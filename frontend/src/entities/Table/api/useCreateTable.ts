import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTable } from './createTable'
import type { CreateTable } from '../model/types'

export function useCreateTable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTable) => createTable(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminTables'] }),
  })
}
