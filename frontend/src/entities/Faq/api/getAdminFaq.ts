import type { FaqFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function getAdminFaq(keywordSearch?: string): Promise<FaqFull[]> {
  const query = keywordSearch ? `?keywordSearch=${encodeURIComponent(keywordSearch)}` : ''
  return apiClient<FaqFull[]>(`/admin/faq/all${query}`)
}
