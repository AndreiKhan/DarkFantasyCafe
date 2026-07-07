import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFaq } from './createFaq'
import type { CreateFaq } from '../model/types'

export function useCreateFaq() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateFaq) => createFaq(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminFaq'] }),
  })
}
