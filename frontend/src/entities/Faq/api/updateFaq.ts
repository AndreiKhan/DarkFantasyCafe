import type { UpdateFaq, FaqFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function updateFaq({ id, ...patch }: UpdateFaq): Promise<FaqFull> {
  return apiClient<FaqFull>(`/admin/faq/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}
