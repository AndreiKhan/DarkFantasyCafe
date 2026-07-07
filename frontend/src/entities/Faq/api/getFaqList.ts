import type { FaqCard } from '../model/types'
import { apiClient } from '@/shared/api'

export function getFaqList(lang: string): Promise<FaqCard[]> {
  return apiClient<FaqCard[]>(`/faq?lang=${lang}`)
}
