import type { ReservationFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function getAdminReservations(keywordSearch?: string): Promise<ReservationFull[]> {
  const query = keywordSearch ? `?keywordSearch=${encodeURIComponent(keywordSearch)}` : ''
  return apiClient<ReservationFull[]>(`/admin/reservation/all${query}`)
}
