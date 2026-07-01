import type { CreateNews, NewsFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function createNews(input: CreateNews): Promise<NewsFull> {
  return apiClient<NewsFull>('/admin/news', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
