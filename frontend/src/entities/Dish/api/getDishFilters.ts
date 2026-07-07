import { apiClient } from '@/shared/api'
import type { DishFilterOptions } from '../model/types'


export function getDishFilters(lang: string): Promise<DishFilterOptions> {
  return apiClient<DishFilterOptions>(`/dish/filters?lang=${lang}`)
}