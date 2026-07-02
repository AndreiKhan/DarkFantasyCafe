import { useQuery } from '@tanstack/react-query'
import { getAdminUsers } from './getAdminUsers'

export function useAdminUsers(keywordSearch?: string) {
  return useQuery({
    queryKey: ['adminUsers', keywordSearch ?? ''],
    queryFn: () => getAdminUsers(keywordSearch),
    placeholderData: (prev) => prev,
  })
}
