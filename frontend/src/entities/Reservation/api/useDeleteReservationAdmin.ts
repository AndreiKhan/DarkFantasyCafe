import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteReservationAdmin } from './deleteReservationAdmin'

export function useDeleteReservationAdmin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteReservationAdmin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminReservations'] }),
  })
}
