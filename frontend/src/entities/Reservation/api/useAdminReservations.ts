import { useQuery } from '@tanstack/react-query'
import { getAdminReservations } from './getAdminReservations'

export function useAdminReservations() {
  return useQuery({
    queryKey: ['adminReservations'],
    queryFn: () => getAdminReservations(),
  })
}
