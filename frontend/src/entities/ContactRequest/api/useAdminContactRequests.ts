import { useQuery } from '@tanstack/react-query'
import { getAdminContactRequests } from './getAdminContactRequests'

export function useAdminContactRequests(keywordSearch?: string) {
  return useQuery({
    queryKey: ['adminContactRequests', keywordSearch ?? ''],
    queryFn: () => getAdminContactRequests(keywordSearch),
    placeholderData: (prev) => prev,
  })
}
