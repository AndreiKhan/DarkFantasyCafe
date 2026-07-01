import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateDish } from './updateDish'
import type { UpdateDish } from '../model/types'

export function useUpdateDish() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateDish) => updateDish(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminDishes'] }),
  })
}
