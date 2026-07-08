import { apiClient } from '@/shared/api'

export function deleteCharacter(id: string): Promise<void> {
  return apiClient<void>(`/character/${id}`, {
    method: 'DELETE',
  })
}
