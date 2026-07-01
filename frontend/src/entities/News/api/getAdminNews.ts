import type { NewsFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function getAdminNews(): Promise<NewsFull[]> {
  return apiClient<NewsFull[]>(`/admin/news/all`)
}
