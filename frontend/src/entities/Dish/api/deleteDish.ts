import { apiClient } from '@/shared/api'

export function deleteDish(id: string): Promise<void> {
  return apiClient<void>(`/admin/dish/${id}`, {
    method: 'DELETE',
  })
}
