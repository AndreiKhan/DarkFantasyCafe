import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteNews } from './deleteNews'

export function useDeleteNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteNews(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminNews'] }),
  })
}
