import type { CreateReservationAdmin, ReservationFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function createReservationAdmin(input: CreateReservationAdmin): Promise<ReservationFull> {
  return apiClient<ReservationFull>('/admin/reservation', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
