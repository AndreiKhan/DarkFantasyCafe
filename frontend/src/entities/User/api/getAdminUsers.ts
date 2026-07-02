import type { UserFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function getAdminUsers(keywordSearch?: string): Promise<UserFull[]> {
  const query = keywordSearch ? `?keywordSearch=${encodeURIComponent(keywordSearch)}` : ''
  return apiClient<UserFull[]>(`/admin/user/all${query}`)
}
