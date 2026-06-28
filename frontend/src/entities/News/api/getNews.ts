import type { NewsDetail } from '../model/types'
import { apiClient } from '@/shared/api'

export function getNews(slug: string, lang: string): Promise<NewsDetail> {
  return apiClient<NewsDetail>(`/news/${slug}?lang=${lang}`)
}