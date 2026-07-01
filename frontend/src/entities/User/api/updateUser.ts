import type { UpdateUser, UserFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function updateUser({ id, ...patch }: UpdateUser): Promise<UserFull> {
  return apiClient<UserFull>(`/admin/user/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}
