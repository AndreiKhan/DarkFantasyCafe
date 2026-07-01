import { apiClient } from '@/shared/api'

export function deleteNews(id: string): Promise<void> {
  return apiClient<void>(`/admin/news/${id}`, {
    method: 'DELETE',
  })
}
