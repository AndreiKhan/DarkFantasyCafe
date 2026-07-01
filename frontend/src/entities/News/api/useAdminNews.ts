import { useQuery } from '@tanstack/react-query'
import { getAdminNews } from './getAdminNews'

export function useAdminNews() {
  return useQuery({
    queryKey: ['adminNews'],
    queryFn: () => getAdminNews(),
  })
}
