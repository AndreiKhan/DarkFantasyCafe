import { prisma } from '../../db/prisma.js'
import type { OrderItemType, ReservationStatus } from '../../../generated/prisma/index.js'
import type { ReservationCreate, ReservationUpdate } from './reservation.schema.js'

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

  createReservation(data: {
    userId: string
    tableId: string
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
}

export const reservationRepositoryAdmin = {
  findAll() {
    return prisma.reservation.findMany({ orderBy: { createdAt: 'desc' },
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

  create(input: ReservationCreate, items: ReservationItem[]) {
    return prisma.reservation.create({
      data: {
        user: { connect: { id: input.userId } },
        table: { connect: { id: input.tableId } },
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        guests: input.guests,
        status: input.status,
        totalAmount: input.totalAmount,
        items: { create: items },
      },
      include: {
        user: { select: { id: true, email: true, firstName: true, secondName: true } },
        table: { select: { id: true, number: true } },
        items: true,
      },
    })
  },

  update(id: string, input: ReservationUpdate, items?: ReservationItem[]) {
    return prisma.reservation.update({
      where: { id },
      data: {
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        guests: input.guests,
        status: input.status,
        totalAmount: input.totalAmount,
        ...(input.userId !== undefined ? { user: { connect: { id: input.userId } } } : {}),
        ...(input.tableId !== undefined ? { table: { connect: { id: input.tableId } } } : {}),
        ...(items !== undefined ? { items: { deleteMany: { type: 'DISH' }, create: items } } : {}),
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