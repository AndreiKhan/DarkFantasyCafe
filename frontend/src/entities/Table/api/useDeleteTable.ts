import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTable } from './deleteTable'

export function useDeleteTable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTable(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminTables'] }),
  })
}
