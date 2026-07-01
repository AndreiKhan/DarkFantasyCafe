import type { CreateTable, TableFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function createTable(input: CreateTable): Promise<TableFull> {
  return apiClient<TableFull>('/admin/table', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
