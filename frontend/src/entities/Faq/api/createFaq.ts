import type { CreateFaq, FaqFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function createFaq(input: CreateFaq): Promise<FaqFull> {
  return apiClient<FaqFull>('/admin/faq', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
