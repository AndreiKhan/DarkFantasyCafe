import { useQuery } from '@tanstack/react-query'
import { getAdminUsers } from './getAdminUsers'

export function useAdminUsers() {
  return useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => getAdminUsers(),
  })
}
