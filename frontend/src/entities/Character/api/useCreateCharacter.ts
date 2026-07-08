import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCharacter } from './createCharacter'
import type { CreateCharacterInput } from '../model/types'

export function useCreateCharacter() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCharacterInput) => createCharacter(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['characters'] })
    },
  })
}
