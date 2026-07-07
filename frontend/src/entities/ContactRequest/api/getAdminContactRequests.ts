import type { ContactRequestFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function getAdminContactRequests(keywordSearch?: string): Promise<ContactRequestFull[]> {
  const query = keywordSearch ? `?keywordSearch=${encodeURIComponent(keywordSearch)}` : ''
  return apiClient<ContactRequestFull[]>(`/admin/contact-request/all${query}`)
}
