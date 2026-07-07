import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateFaq } from './updateFaq'
import type { UpdateFaq } from '../model/types'

export function useUpdateFaq() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateFaq) => updateFaq(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminFaq'] }),
  })
}
