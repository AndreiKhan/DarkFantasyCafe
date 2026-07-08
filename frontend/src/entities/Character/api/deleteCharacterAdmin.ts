import { apiClient } from '@/shared/api'

export function deleteCharacterAdmin(id: string): Promise<void> {
  return apiClient<void>(`/admin/character/${id}`, {
    method: 'DELETE',
  })
}
