import type { DishAdminOptions } from '../model/types'
import { apiClient } from '@/shared/api'

export function getDishOptions(): Promise<DishAdminOptions> {
  return apiClient<DishAdminOptions>(`/admin/dish/options`)
}
