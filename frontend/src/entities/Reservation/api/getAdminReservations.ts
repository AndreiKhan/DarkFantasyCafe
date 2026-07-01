import type { ReservationFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function getAdminReservations(): Promise<ReservationFull[]> {
  return apiClient<ReservationFull[]>(`/admin/reservation/all`)
}
