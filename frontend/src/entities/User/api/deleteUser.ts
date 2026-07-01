import { apiClient } from '@/shared/api'

export function deleteUser(id: string): Promise<void> {
  return apiClient<void>(`/admin/user/${id}`, {
    method: 'DELETE',
  })
}
