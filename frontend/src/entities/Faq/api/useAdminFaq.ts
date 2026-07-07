import { useQuery } from '@tanstack/react-query'
import { getAdminFaq } from './getAdminFaq'

export function useAdminFaq(keywordSearch?: string) {
  return useQuery({
    queryKey: ['adminFaq', keywordSearch ?? ''],
    queryFn: () => getAdminFaq(keywordSearch),
    placeholderData: (prev) => prev,
  })
}
