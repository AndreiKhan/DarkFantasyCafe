import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createUser } from './createUser'
import type { CreateUser } from '../model/types'

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateUser) => createUser(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminUsers'] }),
  })
}
