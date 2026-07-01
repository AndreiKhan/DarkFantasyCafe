import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createReservationAdmin } from './createReservationAdmin'
import type { CreateReservationAdmin } from '../model/types'

export function useCreateReservationAdmin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateReservationAdmin) => createReservationAdmin(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminReservations'] }),
  })
}
