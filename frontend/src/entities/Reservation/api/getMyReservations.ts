import type { ReservationSummary } from '../model/types'
import { apiClient } from '@/shared/api'

export function getMyReservations(lang: 'ru' | 'en'): Promise<ReservationSummary[]> {
  return apiClient<ReservationSummary[]>(`/reservation/mine?lang=${lang}`)
}
