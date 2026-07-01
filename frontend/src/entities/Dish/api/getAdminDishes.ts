import type { DishFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function getAdminDishes(): Promise<DishFull[]> {
  return apiClient<DishFull[]>(`/admin/dish/all`)
}
