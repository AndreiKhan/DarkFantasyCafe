import { reservationRepository, reservationRepositoryAdmin, type ReservationItem } from './reservation.repository.js'
import type { CreateReservation, TablesQuery, ReservationCreate, ReservationUpdate, MastersQuery, MasterSessionType } from './reservation.schema.js'
import { createYooKassaPayment, getYooKassaPayment } from '../../lib/yookassa.js'
import { env } from '../../config/env.js'
import { AppError } from '../../shared/AppError.js'

const BUFFER_MS = 30 * 60 * 1000
const MASTER_PRICE_ONESHOT = 2000
const MASTER_PRICE_CAMPAIGN = 5000
const DRAFT_TTL_MS = 15 * 60 * 1000
const PENDING_PAYMENT_TTL_MS = 60 * 60 * 1000

function cleanupStaleReservations() {
  const now = Date.now()
  return reservationRepository.cleanupStale(
    new Date(now - DRAFT_TTL_MS),
    new Date(now - PENDING_PAYMENT_TTL_MS),
  )
}

function masterSessionPrice(type: MasterSessionType) {
  return type === 'CAMPAIGN' ? MASTER_PRICE_CAMPAIGN : MASTER_PRICE_ONESHOT
}

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

  async getMasters(query: MastersQuery) {
    const { startsAt, endsAt } = buildWindow(query.date, query.start, query.duration)
    return listMasters(startsAt, endsAt)
  },

  async getMastersForWindow(startsAt: Date, endsAt: Date, excludeId?: string) {
    return listMasters(startsAt, endsAt, excludeId)
  },

  async createDraft(userId: string, input: CreateReservation) {
    await cleanupStaleReservations()

    const { startsAt, endsAt } = buildWindow(input.date, input.start, input.duration)

    if (startsAt.getTime() <= Date.now()) {
      throw AppError.badRequest('Reservation time is in the past', 'RESERVATION_IN_PAST')
    }

    const table = await reservationRepository.findTableById(input.tableId)

    if (!table || !table.isActive) {
      throw AppError.notFound('Table not found', 'TABLE_NOT_FOUND')
    }

    if (input.guests > table.capacity) {
      throw AppError.badRequest('Table capacity is too small for the party', 'TABLE_TOO_SMALL')
    }

    const conflicts = await reservationRepository.findConfirmedForTable(
      table.id,
      new Date(startsAt.getTime() - BUFFER_MS),
      new Date(endsAt.getTime() + BUFFER_MS),
    )

    if (conflicts.length > 0) {
      throw AppError.conflict('Table is already booked for this time', 'TABLE_UNAVAILABLE')
    }
    const hours = input.duration / 60

    const items: ReservationItem[] = [
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
        throw AppError.badRequest('One or more dishes not found', 'DISH_NOT_FOUND')
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

    if (input.masterId) {
      const master = await assertMasterAvailable(input.masterId, startsAt, endsAt)
      items.push(buildMasterItem(master, input.masterSessionType!))
    }

    const totalAmount = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

    const reservation = await reservationRepository.createReservation({
      userId,
      tableId: table.id,
      masterId: input.masterId ?? null,
      masterSessionType: input.masterId ? input.masterSessionType ?? null : null,
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
      throw AppError.notFound('Reservation not found', 'RESERVATION_NOT_FOUND')
    }

    if (reservation.userId !== userId) {
      throw AppError.forbidden('Forbidden', 'FORBIDDEN')
    }

    return toSummary(reservation, lang)
  },

  async pay(userId: string, id: string) {
    const reserve = await reservationRepository.findReservationById(id)

    if (!reserve) {
      throw AppError.notFound('Reservation not found', 'RESERVATION_NOT_FOUND')
    }
    if (reserve.userId !== userId) {
      throw AppError.forbidden('Forbidden', 'FORBIDDEN')
    }
    if (reserve.status === 'CONFIRMED') {
      throw AppError.conflict('Reservation already paid', 'ALREADY_PAID')
    }
    if (reserve.status === 'CANCELLED') {
      throw AppError.conflict('Reservation is cancelled', 'RESERVATION_CANCELLED')
    }

    const conflicts = await reservationRepository.findConfirmedForTable(
      reserve.tableId,
      new Date(reserve.startsAt.getTime() - BUFFER_MS),
      new Date(reserve.endsAt.getTime() + BUFFER_MS),
    )
    if (conflicts.length > 0) {
      throw AppError.conflict('Table is already booked for this time', 'TABLE_UNAVAILABLE')
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
      throw AppError.notFound('Reservation not found', 'RESERVATION_NOT_FOUND')
    }
    if (reserve.userId !== userId) {
      throw AppError.forbidden('Forbidden', 'FORBIDDEN')
    }

    return syncPayment(id, lang)
  },

  async handleWebhook(reservationId: string) {
    await syncPayment(reservationId, 'ru')
  },
}

export const reservationAdmin = {
  async getAll(keywordSearch?: string) {
    return reservationRepositoryAdmin.findAll(keywordSearch)
  },

  async getOptions() {
    const [users, tables, dishes] = await Promise.all([
      reservationRepositoryAdmin.findUserOptions(),
      reservationRepositoryAdmin.findTableOptions(),
      reservationRepositoryAdmin.findDishOptions(),
    ])

    return {
      users,
      tables: tables.map((table) => ({
        id: table.id,
        number: table.number,
        zoneNameRu: table.zone.nameRu,
      })),
      dishes,
    }
  },

  async create(input: ReservationCreate) {
    await assertAdminReservationValid(input)

    const items = await buildDishItems(input.dishes)

    if (input.masterId) {
      const master = await assertMasterAvailable(input.masterId, input.startsAt, input.endsAt)
      items.push(buildMasterItem(master, input.masterSessionType!))
    }

    const totalAmount = sumItems(items)
    return reservationRepositoryAdmin.create(input, items, totalAmount)
  },

  async update(id: string, input: ReservationUpdate) {
    const existing = await reservationRepositoryAdmin.findById(id)

    if (!existing) {
      throw AppError.notFound('Reservation not found', 'RESERVATION_NOT_FOUND')
    }

    const startsAt = input.startsAt ?? existing.startsAt
    const endsAt = input.endsAt ?? existing.endsAt

    await assertAdminReservationValid({
      tableId: input.tableId ?? existing.tableId,
      startsAt,
      endsAt,
      guests: input.guests ?? existing.guests,
    }, id)

    const effectiveMasterId = input.masterId !== undefined ? input.masterId : existing.masterId
    const effectiveSessionType = input.masterSessionType !== undefined
      ? input.masterSessionType
      : existing.masterSessionType

    const dishLines = input.dishes ?? existingDishLines(existing.items)
    const items = await buildDishItems(dishLines)

    if (effectiveMasterId) {
      if (!effectiveSessionType) {
        throw AppError.badRequest('Выберите тип истории', 'MASTER_SESSION_TYPE_REQUIRED')
      }
      const master = await assertMasterAvailable(effectiveMasterId, startsAt, endsAt, id)
      items.push(buildMasterItem(master, effectiveSessionType))
    }

    const timeItems = existing.items.filter((item) => item.type === 'TIME')
    const totalAmount = sumItems(timeItems) + sumItems(items)

    return reservationRepositoryAdmin.update(id, input, items, totalAmount)
  },

  async remove(id: string) {
    const existing = await reservationRepositoryAdmin.findById(id)

    if (!existing) {
      throw AppError.notFound('Reservation not found', 'RESERVATION_NOT_FOUND')
    }

    return reservationRepositoryAdmin.remove(id)
  },
}

async function buildDishItems(lines: { dishId: string; quantity: number }[]): Promise<ReservationItem[]> {
  if (lines.length === 0) {
    return []
  }

  const ids = lines.map((line) => line.dishId)
  const dishes = await reservationRepository.findDishesByIds(ids)

  if (dishes.length !== new Set(ids).size) {
    throw AppError.badRequest('One or more dishes not found', 'DISH_NOT_FOUND')
  }

  const byId = new Map(dishes.map((dish) => [dish.id, dish]))

  return lines.map((line) => {
    const dish = byId.get(line.dishId)!
    return {
      type: 'DISH',
      dishId: dish.id,
      titleRu: dish.nameRu,
      titleEn: dish.nameEn,
      unitPrice: dish.price,
      quantity: line.quantity,
    }
  })
}

async function listMasters(startsAt: Date, endsAt: Date, excludeId?: string) {
  const [masters, busyIds] = await Promise.all([
    reservationRepository.findMasters(),
    reservationRepository.findBusyMasterIds(startsAt, endsAt, excludeId),
  ])
  const busy = new Set(busyIds)

  return {
    prices: {
      oneshot: MASTER_PRICE_ONESHOT,
      campaign: MASTER_PRICE_CAMPAIGN
    },
    masters: masters.map((master) => ({
      id: master.id,
      name: masterName(master),
      available: !busy.has(master.id),
      image: master.image,
      bio: master.bio,
    })),
  }
}

async function assertMasterAvailable(masterId: string, startsAt: Date, endsAt: Date, excludeId?: string) {
  const master = await reservationRepository.findMasterById(masterId)

  if (!master || master.role !== 'MASTER') {
    throw AppError.badRequest('Master not found', 'MASTER_NOT_FOUND')
  }

  const busyIds = await reservationRepository.findBusyMasterIds(startsAt, endsAt, excludeId)

  if (busyIds.includes(masterId)) {
    throw AppError.conflict('Master is already booked for this time', 'MASTER_UNAVAILABLE')
  }

  return master
}

function buildMasterItem(
  master: { firstName: string; secondName: string; email: string },
  sessionType: MasterSessionType,
): ReservationItem {
  const name = masterName(master)
  const campaign = sessionType === 'CAMPAIGN'
  return {
    type: 'EXTRA',
    dishId: null,
    titleRu: `Мастер: ${name} (${campaign ? 'кампания' : 'короткая'})`,
    titleEn: `Master: ${name} (${campaign ? 'campaign' : 'oneshot'})`,
    unitPrice: masterSessionPrice(sessionType),
    quantity: 1,
  }
}

function sumItems(items: { unitPrice: number; quantity: number }[]) {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
}

function masterName(master: { firstName: string; secondName: string; email: string }) {
  const full = `${master.firstName} ${master.secondName}`.trim()
  return full || master.email
}

function existingDishLines(items: { type: string; dishId: string | null; quantity: number }[]) {
  return items
    .filter((item) => item.type === 'DISH' && item.dishId)
    .map((item) => ({ dishId: item.dishId as string, quantity: item.quantity }))
}

function assertHalfHourAligned(date: Date) {
  if (date.getUTCMinutes() % 30 !== 0 || date.getUTCSeconds() !== 0 || date.getUTCMilliseconds() !== 0) {
    throw AppError.badRequest('Time must be aligned to 00 or 30 minutes', 'TIME_NOT_ALIGNED')
  }
}

async function assertAdminReservationValid(
  input: { tableId: string; startsAt: Date; endsAt: Date; guests: number },
  excludeId?: string,
) {
  assertHalfHourAligned(input.startsAt)
  assertHalfHourAligned(input.endsAt)

  if (input.endsAt <= input.startsAt) {
    throw AppError.badRequest('End time must be after start time', 'INVALID_TIME_RANGE')
  }

  const table = await reservationRepository.findTableById(input.tableId)

  if (!table || !table.isActive) {
    throw AppError.notFound('Table not found', 'TABLE_NOT_FOUND')
  }
  if (input.guests > table.capacity) {
    throw AppError.badRequest('Table capacity is too small for the party', 'TABLE_TOO_SMALL')
  }

  const conflicts = await reservationRepository.findConfirmedForTable(
    table.id,
    new Date(input.startsAt.getTime() - BUFFER_MS),
    new Date(input.endsAt.getTime() + BUFFER_MS),
  )
  
  if (conflicts.some((reserved) => reserved.id !== excludeId)) {
    throw AppError.conflict('Table is already booked for this time', 'TABLE_UNAVAILABLE')
  }
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
    throw AppError.notFound('Reservation not found', 'RESERVATION_NOT_FOUND')
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