import type { UpdateProfileInput, UserProfile } from '../model/types'
import { apiClient } from '@/shared/api'

export function updateProfile(data: UpdateProfileInput) {
  return apiClient<UserProfile>('/user', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}
