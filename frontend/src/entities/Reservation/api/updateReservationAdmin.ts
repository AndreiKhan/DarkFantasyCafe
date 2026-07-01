import type { UpdateReservationAdmin, ReservationFull } from '../model/types'
import { apiClient } from '@/shared/api'

export function updateReservationAdmin({ id, ...patch }: UpdateReservationAdmin): Promise<ReservationFull> {
  return apiClient<ReservationFull>(`/admin/reservation/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}
