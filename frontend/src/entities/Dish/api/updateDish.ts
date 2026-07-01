import type { UpdateDish, DishFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function updateDish({ id, ...patch }: UpdateDish): Promise<DishFull> {
  return apiClient<DishFull>(`/admin/dish/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}
