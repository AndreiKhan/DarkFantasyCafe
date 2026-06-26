import { reservationRepository, type ReservationItemInput } from './reservation.repository.js'
import type { CreateReservationInput, TablesQuery } from './reservation.schema.js'
import { createYooKassaPayment, getYooKassaPayment } from '../../lib/yookassa.js'
import { env } from '../../config/env.js'

const BUFFER_MS = 30 * 60 * 1000

export const reservationService = {
  async getTables(query: TablesQuery) {
    const { startsAt, endsAt } = buildWindow(query.date, query.start, query.duration)

    const busy = await reservationRepository.findConfirmedBetween(
      new Date(startsAt.getTime() - BUFFER_MS),
      new Date(endsAt.getTime() + BUFFER_MS),
    )

    const busyTableIds = new Set(busy.map((reserved) => reserved.tableId))
    const tables = await reservationRepository.findActiveTables()
    const hours = query.duration / 60

    const zonesMap = new Map<string, {
      id: string
      slug: string
      name: string
      pricePerHour: number
      price: number
      tables: {
        id: string
        number: number
        capacity: number
        x: number
        y: number
        available: boolean
        fitsGuests: boolean
      }[]
    }>()

    for (const table of tables) {
      if (!zonesMap.has(table.zone.id)) {
        zonesMap.set(table.zone.id, {
          id: table.zone.id,
          slug: table.zone.slug,
          name: query.lang === 'en' ? table.zone.nameEn : table.zone.nameRu,
          pricePerHour: table.zone.pricePerHour,
          price: Math.round(table.zone.pricePerHour * hours),
          tables: [],
        })
      }
      zonesMap.get(table.zone.id)!.tables.push({
        id: table.id,
        number: table.number,
        capacity: table.capacity,
        x: table.x,
        y: table.y,
        available: !busyTableIds.has(table.id),
        fitsGuests: table.capacity >= query.guests,
      })
    }

    return {
      window: { startsAt, endsAt, duration: query.duration, guests: query.guests },
      zones: [...zonesMap.values()],
    }
  },

  async createDraft(userId: string, input: CreateReservationInput) {
    const { startsAt, endsAt } = buildWindow(input.date, input.start, input.duration)

    if (startsAt.getTime() <= Date.now()) {
      throw new Error('RESERVATION_IN_PAST')
    }

    const table = await reservationRepository.findTableById(input.tableId)

    if (!table || !table.isActive) {
      throw new Error('TABLE_NOT_FOUND')
    }

    if (input.guests > table.capacity) {
      throw new Error('TABLE_TOO_SMALL')
    }

    const conflicts = await reservationRepository.findConfirmedForTable(
      table.id,
      new Date(startsAt.getTime() - BUFFER_MS),
      new Date(endsAt.getTime() + BUFFER_MS),
    )

    if (conflicts.length > 0) {
      throw new Error('TABLE_UNAVAILABLE')
    }
    const hours = input.duration / 60

    const items: ReservationItemInput[] = [
      {
        type: 'TIME',
        dishId: null,
        titleRu: `Стол «${table.zone.nameRu}», ${hours} ч`,
        titleEn: `${table.zone.nameEn} table, ${hours}h`,
        unitPrice: Math.round(table.zone.pricePerHour * hours),
        quantity: 1,
      },
    ]

    if (input.dishes.length > 0) {
      const ids = input.dishes.map((dish) => dish.dishId)

      const dishes = await reservationRepository.findDishesByIds(ids)

      if (dishes.length !== new Set(ids).size) {
        throw new Error('DISH_NOT_FOUND')
      }
      const byId = new Map(dishes.map((dish) => [dish.id, dish]))

      for (const line of input.dishes) {
        const dish = byId.get(line.dishId)!
        items.push({
          type: 'DISH',
          dishId: dish.id,
          titleRu: dish.nameRu,
          titleEn: dish.nameEn,
          unitPrice: dish.price,
          quantity: line.quantity,
        })
      }
    }

    const totalAmount = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

    const reservation = await reservationRepository.createReservation({
      userId,
      tableId: table.id,
      startsAt,
      endsAt,
      guests: input.guests,
      totalAmount,
      items,
    })

    return toSummary(reservation, input.lang)
  },

  async getById(userId: string, id: string, lang: 'ru' | 'en') {
    const reservation = await reservationRepository.findReservationById(id)

    if (!reservation) {
      throw new Error('RESERVATION_NOT_FOUND')
    }

    if (reservation.userId !== userId) {
      throw new Error('FORBIDDEN')
    }

    return toSummary(reservation, lang)
  },

  async pay(userId: string, id: string) {
    const reserve = await reservationRepository.findReservationById(id)

    if (!reserve) {
      throw new Error('RESERVATION_NOT_FOUND')
    }
    if (reserve.userId !== userId) {
      throw new Error('FORBIDDEN')
    }
    if (reserve.status === 'CONFIRMED') {
      throw new Error('ALREADY_PAID')
    }
    if (reserve.status === 'CANCELLED') {
      throw new Error('RESERVATION_CANCELLED')
    }

    const conflicts = await reservationRepository.findConfirmedForTable(
      reserve.tableId,
      new Date(reserve.startsAt.getTime() - BUFFER_MS),
      new Date(reserve.endsAt.getTime() + BUFFER_MS),
    )
    if (conflicts.length > 0) {
      throw new Error('TABLE_UNAVAILABLE')
    }

    const payment = await createYooKassaPayment({
      amount: reserve.totalAmount,
      description: `Reservation #${reserve.table.number}`,
      returnUrl: `${env.FRONTEND_URL}/reserve/success?reservationId=${reserve.id}`,
      metadata: { reservationId: reserve.id },
    })

    await reservationRepository.upsertPayment(reserve.id, payment.id, reserve.totalAmount)
    await reservationRepository.setReservationStatus(reserve.id, 'PENDING_PAYMENT')

    return {
      confirmationUrl: payment.confirmation?.confirmation_url ?? null
    }
  },

  async getStatus(userId: string, id: string, lang: 'ru' | 'en') {
    const reserve = await reservationRepository.findReservationById(id)

    if (!reserve) {
      throw new Error('RESERVATION_NOT_FOUND')
    }
    if (reserve.userId !== userId) {
      throw new Error('FORBIDDEN')
    }

    return syncPayment(id, lang)
  },

  async handleWebhook(reservationId: string) {
    await syncPayment(reservationId, 'ru')
  },
}

function buildWindow(date: string, start: string, duration: number) {
  const startsAt = new Date(`${date}T${start}:00`)
  const endsAt = new Date(startsAt.getTime() + duration * 60 * 1000)

  return { startsAt, endsAt }
}

function toSummary(reserve: Awaited<ReturnType<typeof reservationRepository.findReservationById>>, lang: 'ru' | 'en') {
  if (!reserve) {
    return null
  } // 

  return {
    id: reserve.id,
    status: reserve.status,
    startsAt: reserve.startsAt,
    endsAt: reserve.endsAt,
    guests: reserve.guests,
    totalAmount: reserve.totalAmount,
    table: {
      number: reserve.table.number,
      zone: lang === 'en' ? reserve.table.zone.nameEn : reserve.table.zone.nameRu,
    },
    items: reserve.items.map((item) => ({
      type: item.type,
      title: lang === 'en' ? item.titleEn : item.titleRu,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    })),
  }
}

async function syncPayment(id: string, lang: 'ru' | 'en') {
  const reserve = await reservationRepository.findReservationById(id)

  if (!reserve) {
    throw new Error('RESERVATION_NOT_FOUND')
  }
  if (!reserve.payment?.providerPaymentId) {
    return toSummary(reserve, lang)
  }
  if (reserve.status === 'CONFIRMED' || reserve.status === 'CANCELLED') {
    return toSummary(reserve, lang)
  }

  const yoo = await getYooKassaPayment(reserve.payment.providerPaymentId)

  if (yoo.status === 'succeeded') {
    const conflicts = await reservationRepository.findConfirmedForTable(
      reserve.tableId,
      new Date(reserve.startsAt.getTime() - BUFFER_MS),
      new Date(reserve.endsAt.getTime() + BUFFER_MS),
    )
    
    await reservationRepository.setPaymentStatus(reserve.id, 'SUCCEEDED')
    await reservationRepository.setReservationStatus(
      reserve.id,
      conflicts.length > 0 ? 'CANCELLED' : 'CONFIRMED',
    )
  } else if (yoo.status === 'canceled') {
    await reservationRepository.setPaymentStatus(reserve.id, 'CANCELED')
    await reservationRepository.setReservationStatus(reserve.id, 'CANCELLED')
  }

  return toSummary(await reservationRepository.findReservationById(reserve.id), lang)
}