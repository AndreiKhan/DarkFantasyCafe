import type { ReservationAdminOptions } from '../model/types'
import { apiClient } from '@/shared/api'

export function getReservationOptions(): Promise<ReservationAdminOptions> {
  return apiClient<ReservationAdminOptions>(`/admin/reservation/options`)
}
