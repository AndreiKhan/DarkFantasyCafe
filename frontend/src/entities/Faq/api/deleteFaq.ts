import { apiClient } from '@/shared/api'

export function deleteFaq(id: string): Promise<void> {
  return apiClient<void>(`/admin/faq/${id}`, {
    method: 'DELETE',
  })
}
