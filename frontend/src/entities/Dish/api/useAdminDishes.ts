import { useQuery } from '@tanstack/react-query'
import { getAdminDishes } from './getAdminDishes'

export function useAdminDishes(keywordSearch?: string) {
  return useQuery({
    queryKey: ['adminDishes', keywordSearch ?? ''],
    queryFn: () => getAdminDishes(keywordSearch),
    placeholderData: (prev) => prev,
  })
}
