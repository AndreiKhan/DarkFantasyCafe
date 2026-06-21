import type { Dish } from '../model/types'
// import { mockDishes } from '../mocks/dishes'
import { apiClient } from '@/shared/api'

export async function getDishes(): Promise<Dish[]> {
  // return Promise.resolve(mockDishes)
  return apiClient<Dish[]>('/dish')
}