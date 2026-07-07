import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteFaq } from './deleteFaq'

export function useDeleteFaq() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteFaq(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminFaq'] }),
  })
}
