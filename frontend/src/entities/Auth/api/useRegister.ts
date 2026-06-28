import { useMutation, useQueryClient } from '@tanstack/react-query'
import { register } from './register'
import type { RegisterInput } from '../model/types'

export function useRegister() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  })
}
