import { apiClient } from '@/shared/api'
import { tokenStore } from '@/shared/api/tokenStore'

export async function logout() {
  await apiClient('/auth/logout', { method: 'POST' })
  tokenStore.set(null)
}
