import type { UserProfile } from '../model/types'
import { apiClient } from '@/shared/api'

export function getProfile() {
  return apiClient<UserProfile>('/user')
}