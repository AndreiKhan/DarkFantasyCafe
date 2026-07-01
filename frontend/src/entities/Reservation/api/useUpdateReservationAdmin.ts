import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateReservationAdmin } from './updateReservationAdmin'
import type { UpdateReservationAdmin } from '../model/types'

export function useUpdateReservationAdmin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateReservationAdmin) => updateReservationAdmin(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminReservations'] }),
  })
}
