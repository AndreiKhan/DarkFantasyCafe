import type { TableFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function getAdminTables(keywordSearch?: string): Promise<TableFull[]> {
  const query = keywordSearch ? `?keywordSearch=${encodeURIComponent(keywordSearch)}` : ''
  return apiClient<TableFull[]>(`/admin/table/all${query}`)
}
