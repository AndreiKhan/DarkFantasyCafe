import { prisma } from '../../db/prisma.js'
import type { StatsQuery } from './stats.schema.js'

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function endOfDay(date: Date) {
  const end = new Date(date)
  end.setHours(23, 59, 59, 999)
  return end
}

export const statsRepository = {
  getReservations(from: Date, to: Date) {
    return prisma.reservation.findMany({
      where: {
        createdAt: { gte: from, lte: to },
      },
      select: {
        createdAt: true,
        status: true,
        totalAmount: true,
      },
    })
  },

  getDishItems(from: Date, to: Date) {
    return prisma.orderItem.findMany({
      where: {
        type: 'DISH',
        reservation: {
          status: 'CONFIRMED',
          createdAt: { gte: from, lte: to },
        },
      },
      select: {
        titleRu: true,
        quantity: true,
      },
    })
  },
}

export function buildStats(query: StatsQuery) {
  const from = query.from
  const to = endOfDay(query.to)

  return Promise.all([
    statsRepository.getReservations(from, to),
    statsRepository.getDishItems(from, to),
  ]).then(([reservations, dishItems]) => {
    const confirmed = reservations.filter((item) => item.status === 'CONFIRMED')
    const totalRevenue = confirmed.reduce((sum, item) => sum + item.totalAmount, 0)

    const byDay = new Map<string, number>()
    for (const item of confirmed) {
      const key = toDateKey(item.createdAt)
      byDay.set(key, (byDay.get(key) ?? 0) + 1)
    }

    const reservationsByDay = [...byDay.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }))

    const dishTotals = new Map<string, number>()
    for (const item of dishItems) {
      dishTotals.set(item.titleRu, (dishTotals.get(item.titleRu) ?? 0) + item.quantity)
    }

    const popularDishes = [...dishTotals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, quantity]) => ({ name, quantity }))

    return {
      reservationsTotal: reservations.length,
      reservationsConfirmed: confirmed.length,
      totalRevenue,
      reservationsByDay,
      popularDishes,
    }
  })
}
