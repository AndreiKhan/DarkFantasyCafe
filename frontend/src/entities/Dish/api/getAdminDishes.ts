import type { DishFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function getAdminDishes(keywordSearch?: string): Promise<DishFull[]> {
  const query = keywordSearch ? `?keywordSearch=${encodeURIComponent(keywordSearch)}` : ''
  return apiClient<DishFull[]>(`/admin/dish/all${query}`)
}
