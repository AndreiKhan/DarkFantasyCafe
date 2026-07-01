import { apiClient } from '@/shared/api'

export function deleteReservationAdmin(id: string): Promise<void> {
  return apiClient<void>(`/admin/reservation/${id}`, {
    method: 'DELETE',
  })
}
