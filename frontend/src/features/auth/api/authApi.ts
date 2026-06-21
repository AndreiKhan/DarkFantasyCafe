import { apiClient } from '@/shared/api'
import { tokenStore } from '@/shared/api/tokenStore'

interface AuthResponse {
  accessToken: string
}

export interface AuthUser {
  sub: string
  role: string
}

export const authApi = {
  async register(email: string, password: string) {
    const { accessToken } = await apiClient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    tokenStore.set(accessToken)
  },

  async login(email: string, password: string) {
    const { accessToken } = await apiClient<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    tokenStore.set(accessToken)
  },

  async logout() {
    await apiClient('/auth/logout', { method: 'POST' })
    tokenStore.set(null)
  },

  me() {
    return apiClient<{ user: AuthUser }>('/auth/me')
  },
}