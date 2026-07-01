import { useQuery } from '@tanstack/react-query'
import { getAdminDishes } from './getAdminDishes'

export function useAdminDishes() {
  return useQuery({
    queryKey: ['adminDishes'],
    queryFn: () => getAdminDishes(),
  })
}
