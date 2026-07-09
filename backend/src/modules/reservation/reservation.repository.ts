import { prisma } from '../../db/prisma.js'
import type { OrderItemType, ReservationStatus } from '../../../generated/prisma/index.js'
import type { ReservationCreate, ReservationUpdate } from './reservation.schema.js'
import type { MasterSessionType } from '../../../generated/prisma/index.js'

export interface ReservationItem {
  type: OrderItemType
  dishId: string | null
  titleRu: string
  titleEn: string
  unitPrice: number
  quantity: number
}

export const reservationRepository = {
  findActiveTables() {
    return prisma.table.findMany({
      where: { isActive: true },
      include: { zone: true },
      orderBy: { number: 'asc' },
    })
  },

  findConfirmedBetween(from: Date, to: Date) {
    return prisma.reservation.findMany({
      where: {
        status: 'CONFIRMED',
        startsAt: { lt: to },
        endsAt: { gt: from },
      },
      select: { tableId: true },
    })
  },

  findTableById(id: string) {
    return prisma.table.findUnique({
      where: { id },
      include: { zone: true },
    })
  },

  findDishesByIds(ids: string[]) {
    return prisma.dish.findMany({
      where: { id: { in: ids }, deletedAt: null },
      select: {
        id: true,
        nameRu: true,
        nameEn: true,
        price: true
      }
    })
  },

  findConfirmedForTable(tableId: string, from: Date, to: Date) {
    return prisma.reservation.findMany({
      where: {
        tableId,
        status: 'CONFIRMED',
        startsAt: { lt: to },
        endsAt: { gt: from },
      },
      select: { id: true },
    })
  },

  findMasters() {
    return prisma.user.findMany({
      where: { role: 'MASTER' },
      orderBy: [
        { firstName: 'asc' },
        { secondName: 'asc' }
      ],
      select: {
        id: true,
        firstName: true,
        secondName: true,
        email: true,
        image: true,
        bio: true
      },
    })
  },

  findMasterById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
        firstName: true,
        secondName: true,
        email: true
      },
    })
  },

  async findBusyMasterIds(from: Date, to: Date, excludeId?: string): Promise<string[]> {
    const rows = await prisma.reservation.findMany({
      where: {
        masterId: { not: null },
        status: { in: ['DRAFT', 'PENDING_PAYMENT', 'CONFIRMED'] },
        startsAt: { lt: to },
        endsAt: { gt: from },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { masterId: true },
    })
    return rows.map((row) => row.masterId!).filter(Boolean)
  },

  createReservation(data: {
    userId: string
    tableId: string
    masterId?: string | null
    masterSessionType?: MasterSessionType | null
    startsAt: Date
    endsAt: Date
    guests: number
    totalAmount: number
    items: ReservationItem[]
  }) {
    return prisma.reservation.create({
      data: {
        userId: data.userId,
        tableId: data.tableId,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
        guests: data.guests,
        totalAmount: data.totalAmount,
        status: 'DRAFT',
        masterId: data.masterId ?? null,
        masterSessionType: data.masterId ? data.masterSessionType ?? null : null,
        items: { create: data.items },
      },
      include: { items: true, table: { include: { zone: true } } },
    })
  },

  findReservationById(id: string) {
    return prisma.reservation.findUnique({
      where: { id },
      include: { items: true,
        table: { include: { zone: true } },
        payment: true
      },
    })
  },

  findConfirmedByUser(userId: string) {
    return prisma.reservation.findMany({
      where: { userId, status: 'CONFIRMED' },
      include: {
        items: true,
        table: { include: { zone: true } },
      },
      orderBy: { startsAt: 'desc' },
    })
  },

  upsertPayment(reservationId: string, providerPaymentId: string, amount: number) {
    return prisma.payment.upsert({
      where: { reservationId },
      create: {
        reservationId,
        providerPaymentId,
        amount,
        status: 'PENDING'
      },
      update: {
        providerPaymentId,
        amount,
        status: 'PENDING'
      },
    })
  },

  setPaymentStatus(reservationId: string, status: 'PENDING' | 'SUCCEEDED' | 'CANCELED') {
    return prisma.payment.update({
      where: { reservationId },
      data: { status }
    })
  },

  setReservationStatus( id: string, status: 'DRAFT' | 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED' ) {
    return prisma.reservation.update({
      where: { id },
      data: { status }
    })
  },

  async cleanupStale(draftBefore: Date, pendingPaymentBefore: Date) {
    await prisma.reservation.deleteMany({
      where: { status: 'DRAFT', createdAt: { lt: draftBefore } },
    })
    await prisma.reservation.updateMany({
      where: { status: 'PENDING_PAYMENT', createdAt: { lt: pendingPaymentBefore } },
      data: { status: 'CANCELLED' },
    })
  },
}

export const reservationRepositoryAdmin = {
  findAll(keywordSearch?: string) {
    const num = keywordSearch !== undefined && keywordSearch !== '' && Number.isInteger(Number(keywordSearch))
      ? Number(keywordSearch)
      : null
    return prisma.reservation.findMany({
      where: keywordSearch
        ? {
            OR: [
              { user: { email: { contains: keywordSearch, mode: 'insensitive' } } },
              { user: { firstName: { contains: keywordSearch, mode: 'insensitive' } } },
              { user: { secondName: { contains: keywordSearch, mode: 'insensitive' } } },
              ...(num !== null ? [{ table: { number: num } }] : []),
            ],
          }
        : {},
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, firstName: true, secondName: true } },
        table: { select: { id: true, number: true } },
        items: true,
      }
    })
  },

  findById(id: string) {
    return prisma.reservation.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, firstName: true, secondName: true } },
        table: { select: { id: true, number: true } },
        items: true,
      }
    })
  },

  findUserOptions() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {id: true, email: true, firstName: true, secondName: true },
    })
  },

  findTableOptions() {
    return prisma.table.findMany({ orderBy: { number: 'asc' }, include: { zone: true } })
  },

  findDishOptions() {
    return prisma.dish.findMany({
      where: { deletedAt: null },
      orderBy: { nameRu: 'asc' },
      select: { id: true, nameRu: true, nameEn: true, price: true },
    })
  },

  create(input: ReservationCreate, items: ReservationItem[], totalAmount: number) {
    return prisma.reservation.create({
      data: {
        user: { connect: { id: input.userId } },
        table: { connect: { id: input.tableId } },
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        guests: input.guests,
        status: input.status,
        totalAmount,
        masterId: input.masterId ?? null,
        masterSessionType: input.masterId ? input.masterSessionType ?? null : null,
        items: { create: items },
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, secondName: true } },
        table: { select: { id: true, number: true } },
        items: true,
      },
    })
  },

  update(id: string, input: ReservationUpdate, items: ReservationItem[] | undefined, totalAmount: number | undefined) {
    return prisma.reservation.update({
      where: { id },
      data: {
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        guests: input.guests,
        status: input.status,
        ...(totalAmount !== undefined ? { totalAmount } : {}),
        ...(input.userId !== undefined ? { user: { connect: { id: input.userId } } } : {}),
        ...(input.tableId !== undefined ? { table: { connect: { id: input.tableId } } } : {}),
        ...(input.masterId !== undefined && {
          masterId: input.masterId,
          masterSessionType: input.masterId ? input.masterSessionType ?? null : null,
        }),
        ...(items !== undefined ? { items: { deleteMany: { type: { in: ['DISH', 'EXTRA'] } }, create: items } } : {}),
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, secondName: true } },
        table: { select: { id: true, number: true } },
        items: true,
      },
    })
  },

  remove(id: string) {
    return prisma.reservation.delete({ where: { id } })
  },
}