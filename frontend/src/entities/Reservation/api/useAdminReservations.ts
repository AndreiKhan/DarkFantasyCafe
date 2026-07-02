import { useQuery } from '@tanstack/react-query'
import { getAdminReservations } from './getAdminReservations'

export function useAdminReservations(keywordSearch?: string) {
  return useQuery({
    queryKey: ['adminReservations', keywordSearch ?? ''],
    queryFn: () => getAdminReservations(keywordSearch),
    placeholderData: (prev) => prev,
  })
}
