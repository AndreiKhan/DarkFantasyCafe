import type { CreateReservationInput, ReservationSummary } from '../model/types'
import { apiClient } from '@/shared/api'

export function createReservation( input: { lang: string } & CreateReservationInput ): Promise<ReservationSummary> {
  return apiClient<ReservationSummary>('/reservation', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}