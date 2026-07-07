import { apiClient } from '@/shared/api'

export function deleteContactRequest(id: string): Promise<void> {
  return apiClient<void>(`/admin/contact-request/${id}`, {
    method: 'DELETE',
  })
}
