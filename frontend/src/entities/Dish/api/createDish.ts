import type { CreateDish, DishFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function createDish(input: CreateDish): Promise<DishFull> {
  return apiClient<DishFull>('/admin/dish', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
