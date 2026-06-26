import { apiClient } from '@/shared/api'

export function payReservation(id: string): Promise<{ confirmationUrl: string | null }> {
  return apiClient(`/reservation/${id}/pay`, { method: 'POST' })
}