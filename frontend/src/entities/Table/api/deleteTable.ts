import { apiClient } from '@/shared/api'

export function deleteTable(id: string): Promise<void> {
  return apiClient<void>(`/admin/table/${id}`, {
    method: 'DELETE',
  })
}
