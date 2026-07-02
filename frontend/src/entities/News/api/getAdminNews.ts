import type { NewsFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function getAdminNews(keywordSearch?: string): Promise<NewsFull[]> {
  const query = keywordSearch ? `?keywordSearch=${encodeURIComponent(keywordSearch)}` : ''
  return apiClient<NewsFull[]>(`/admin/news/all${query}`)
}
