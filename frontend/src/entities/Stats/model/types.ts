export interface AdminStats {
  reservationsTotal: number
  reservationsConfirmed: number
  totalRevenue: number
  reservationsByDay: { date: string; count: number }[]
  popularDishes: { name: string; quantity: number }[]
}

export interface AdminStatsQuery {
  from: string
  to: string
}
