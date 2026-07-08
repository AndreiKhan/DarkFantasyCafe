import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCharacter } from './deleteCharacter'

export function useDeleteCharacter() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCharacter(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['characters'] })
    },
  })
}
