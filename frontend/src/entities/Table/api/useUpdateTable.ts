import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTable } from './updateTable'
import type { UpdateTable } from '../model/types'

export function useUpdateTable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateTable) => updateTable(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminTables'] }),
  })
}
