import type { CreateUser, UserFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function createUser(input: CreateUser): Promise<UserFull> {
  return apiClient<UserFull>('/admin/user', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
