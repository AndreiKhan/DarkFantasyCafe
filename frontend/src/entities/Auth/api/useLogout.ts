import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logout } from './logout'

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => qc.setQueryData(['me'], null),
  })
}
