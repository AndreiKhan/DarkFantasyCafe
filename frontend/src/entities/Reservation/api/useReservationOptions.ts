import { useQuery } from '@tanstack/react-query'
import { getReservationOptions } from './getReservationOptions'

export function useReservationOptions() {
  return useQuery({
    queryKey: ['reservationOptions'],
    queryFn: () => getReservationOptions(),
  })
}
