import type { CreateReservation, ReservationSummary } from '../model/types'
import { apiClient } from '@/shared/api'

export function createReservation( input: { lang: string } & CreateReservation ): Promise<ReservationSummary> {
  return apiClient<ReservationSummary>('/reservation', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}