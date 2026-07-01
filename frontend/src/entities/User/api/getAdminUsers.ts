import type { UserFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function getAdminUsers(): Promise<UserFull[]> {
  return apiClient<UserFull[]>(`/admin/user/all`)
}
