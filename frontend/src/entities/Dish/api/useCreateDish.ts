import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createDish } from './createDish'
import type { CreateDish } from '../model/types'

export function useCreateDish() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateDish) => createDish(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminDishes'] }),
  })
}
