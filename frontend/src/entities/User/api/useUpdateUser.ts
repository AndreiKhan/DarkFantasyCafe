import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from './updateUser'
import type { UpdateUser } from '../model/types'

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateUser) => updateUser(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminUsers'] }),
  })
}
