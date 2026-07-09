import { apiClient } from '@/shared/api'

export function changePassword(currentPassword: string, newPassword: string) {
  return apiClient<{ ok: true }>('/user/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}
