import { useQuery } from '@tanstack/react-query'
import { getAdminTables } from './getAdminTables'

export function useAdminTables(keywordSearch?: string) {
  return useQuery({
    queryKey: ['adminTables', keywordSearch ?? ''],
    queryFn: () => getAdminTables(keywordSearch),
    placeholderData: (prev) => prev,
  })
}
