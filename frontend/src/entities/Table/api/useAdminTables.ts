import { useQuery } from '@tanstack/react-query'
import { getAdminTables } from './getAdminTables'

export function useAdminTables() {
  return useQuery({
    queryKey: ['adminTables'],
    queryFn: () => getAdminTables(),
  })
}
