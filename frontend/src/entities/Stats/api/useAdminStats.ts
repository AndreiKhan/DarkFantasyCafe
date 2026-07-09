import { useQuery } from '@tanstack/react-query'
import { getAdminStats } from './getAdminStats'
import type { AdminStatsQuery } from '../model/types'

export function useAdminStats(query: AdminStatsQuery) {
  return useQuery({
    queryKey: ['admin', 'stats', query],
    queryFn: () => getAdminStats(query),
  })
}
