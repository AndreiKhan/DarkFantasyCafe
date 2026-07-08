import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCharacterAdmin } from './deleteCharacterAdmin'

export function useDeleteCharacterAdmin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCharacterAdmin(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminCharacters'] })
      qc.invalidateQueries({ queryKey: ['characters'] })
    },
  })
}
