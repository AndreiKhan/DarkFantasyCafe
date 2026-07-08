import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCharacter } from './updateCharacter'
import type { UpdateCharacterInput } from '../model/types'

export function useUpdateCharacter() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateCharacterInput) => updateCharacter(input),
    onSuccess: (character) => {
      qc.invalidateQueries({ queryKey: ['characters'] })
      qc.invalidateQueries({ queryKey: ['character', character.id] })
    },
  })
}
