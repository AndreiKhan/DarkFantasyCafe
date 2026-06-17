import type { Dish } from '../model/types'
import { mockDishes } from '../mocks/dishes'

export async function getDishes(): Promise<Dish[]> {
  return Promise.resolve(mockDishes)
}