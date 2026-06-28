import type { AuthResponse, RegisterInput } from '../model/types'
import { apiClient } from '@/shared/api'
import { tokenStore } from '@/shared/api/tokenStore'

export async function register(input: RegisterInput) {
  const { accessToken } = await apiClient<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  tokenStore.set(accessToken)
}
