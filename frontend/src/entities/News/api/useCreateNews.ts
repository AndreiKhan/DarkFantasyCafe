import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNews } from './createNews'
import type { CreateNews } from '../model/types'

export function useCreateNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateNews) => createNews(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminNews'] }),
  })
}
