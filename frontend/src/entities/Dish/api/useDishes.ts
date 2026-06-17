import { useQuery } from '@tanstack/react-query'
import { getDishes } from './getDishes'

export function useDishes() {
  return useQuery({
    queryKey: ['dishes'],
    queryFn: getDishes,
  })
}