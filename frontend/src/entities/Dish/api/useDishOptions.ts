import { useQuery } from '@tanstack/react-query'
import { getDishOptions } from './getDishOptions'

export function useDishOptions() {
  return useQuery({
    queryKey: ['dishOptions'],
    queryFn: () => getDishOptions(),
  })
}
