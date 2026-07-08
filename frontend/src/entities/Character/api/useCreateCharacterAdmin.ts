import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCharacterAdmin } from './createCharacterAdmin'
import type { CreateCharacterAdminInput } from '../model/types'

export function useCreateCharacterAdmin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCharacterAdminInput) => createCharacterAdmin(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminCharacters'] })
      qc.invalidateQueries({ queryKey: ['characters'] })
    },
  })
}
