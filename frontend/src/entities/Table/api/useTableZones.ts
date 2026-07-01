import { useQuery } from '@tanstack/react-query'
import { getTableZones } from './getTableZones'

export function useTableZones() {
  return useQuery({
    queryKey: ['tableZones'],
    queryFn: () => getTableZones(),
  })
}
