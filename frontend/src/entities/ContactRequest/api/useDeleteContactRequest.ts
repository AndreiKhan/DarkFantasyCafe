import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteContactRequest } from './deleteContactRequest'

export function useDeleteContactRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteContactRequest(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminContactRequests'] }),
  })
}
