import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteDish } from './deleteDish'

export function useDeleteDish() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDish(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminDishes'] }),
  })
}
