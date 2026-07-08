import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCharacterAdmin } from './updateCharacterAdmin'
import type { UpdateCharacterAdminInput } from '../model/types'

export function useUpdateCharacterAdmin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateCharacterAdminInput) => updateCharacterAdmin(input),
    onSuccess: (character) => {
      qc.invalidateQueries({ queryKey: ['adminCharacters'] })
      qc.invalidateQueries({ queryKey: ['characters'] })
      qc.invalidateQueries({ queryKey: ['character', character.id] })
    },
  })
}
