import type { UpdateNews, NewsFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function updateNews({ id, ...patch }: UpdateNews): Promise<NewsFull> {
  return apiClient<NewsFull>(`/admin/news/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}
