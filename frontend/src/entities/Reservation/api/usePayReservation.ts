import { useMutation } from '@tanstack/react-query'
import { payReservation } from './payReservation'

export function usePayReservation() {
  return useMutation({ mutationFn: (id: string) => payReservation(id) })
}