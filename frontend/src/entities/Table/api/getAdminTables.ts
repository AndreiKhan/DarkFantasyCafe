import type { TableFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function getAdminTables(): Promise<TableFull[]> {
  return apiClient<TableFull[]>(`/admin/table/all`)
}
