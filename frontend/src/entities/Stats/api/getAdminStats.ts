import type { AdminStats, AdminStatsQuery } from '../model/types'
import { apiClient } from '@/shared/api'

export function getAdminStats(query: AdminStatsQuery): Promise<AdminStats> {
  const params = new URLSearchParams({ from: query.from, to: query.to })
  return apiClient<AdminStats>(`/admin/stats?${params.toString()}`)
}
