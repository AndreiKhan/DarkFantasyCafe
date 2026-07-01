import type { TableAdminZones } from '../model/types'
import { apiClient } from '@/shared/api'

export function getTableZones(): Promise<TableAdminZones> {
  return apiClient<TableAdminZones>(`/admin/table/zones`)
}
