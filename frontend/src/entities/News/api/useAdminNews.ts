import { useQuery } from '@tanstack/react-query'
import { getAdminNews } from './getAdminNews'

export function useAdminNews(keywordSearch?: string) {
  return useQuery({
    queryKey: ['adminNews', keywordSearch ?? ''],
    queryFn: () => getAdminNews(keywordSearch),
    placeholderData: (prev) => prev,
  })
}
