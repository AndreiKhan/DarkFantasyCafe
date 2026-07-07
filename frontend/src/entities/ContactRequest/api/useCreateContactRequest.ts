import { useMutation } from '@tanstack/react-query'
import { createContactRequest } from './createContactRequest'
import type { CreateContactRequest } from '../model/types'

export function useCreateContactRequest() {
  return useMutation({
    mutationFn: (input: CreateContactRequest) => createContactRequest(input),
  })
}
