import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUser } from './deleteUser'

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminUsers'] }),
  })
}
