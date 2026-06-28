import type { AuthUser } from '../model/types'
import { apiClient } from '@/shared/api'

export function getMe() {
  return apiClient<{ user: AuthUser }>('/auth/me')
}
