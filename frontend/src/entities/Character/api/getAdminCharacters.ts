import type { CharacterAdmin } from '../model/types'
import { apiClient } from '@/shared/api'

export function getAdminCharacters(keywordSearch?: string): Promise<CharacterAdmin[]> {
  const query = keywordSearch ? `?keywordSearch=${encodeURIComponent(keywordSearch)}` : ''
  return apiClient<CharacterAdmin[]>(`/admin/character/all${query}`)
}
