import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateNews } from './updateNews'
import type { UpdateNews } from '../model/types'

export function useUpdateNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateNews) => updateNews(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminNews'] }),
  })
}
