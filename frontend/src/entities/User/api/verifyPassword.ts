import { apiClient } from '@/shared/api'

export function verifyPassword(password: string) {
  return apiClient<{ ok: true }>('/user/verify-password', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
}
