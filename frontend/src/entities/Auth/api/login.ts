import type { AuthResponse, LoginInput } from '../model/types'
import { apiClient } from '@/shared/api'
import { tokenStore } from '@/shared/api/tokenStore'

export async function login(input: LoginInput) {
  const { accessToken } = await apiClient<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  tokenStore.set(accessToken)
}
