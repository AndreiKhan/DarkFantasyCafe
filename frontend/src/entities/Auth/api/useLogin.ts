import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from './login'
import type { LoginInput } from '../model/types'

export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  })
}
