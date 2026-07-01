import type { UpdateTable, TableFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function updateTable({ id, ...patch }: UpdateTable): Promise<TableFull> {
  return apiClient<TableFull>(`/admin/table/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}
