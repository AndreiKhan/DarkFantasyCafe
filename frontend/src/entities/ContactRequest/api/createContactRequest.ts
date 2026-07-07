import type { CreateContactRequest, ContactRequestFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function createContactRequest(input: CreateContactRequest): Promise<ContactRequestFull> {
  return apiClient<ContactRequestFull>('/contact-request', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
