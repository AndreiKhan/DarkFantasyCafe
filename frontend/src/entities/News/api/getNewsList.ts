import type { NewsCard, NewsType } from '../model/types'
import { apiClient } from '@/shared/api'

export function getNewsList(lang: string , type?: NewsType): Promise<NewsCard[]> {
  const search = new URLSearchParams()
  search.set('lang', lang)

  if (type) {
    search.set('type', type)
  }

  return apiClient<NewsCard[]>(`/news?${search.toString()}`)
}