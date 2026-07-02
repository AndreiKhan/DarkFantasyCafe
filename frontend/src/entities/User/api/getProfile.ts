import type { UserProfile } from '../model/types'
import { apiClient } from '@/shared/api'

export function getProfile(userId: string) {
  return apiClient<UserProfile>(`/user/${userId}`)
}