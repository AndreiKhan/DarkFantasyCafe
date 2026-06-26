import type { AvailabilityParams, AvailabilityResponse } from '../model/types'
import { apiClient } from '@/shared/api'

export function getAvailability( params: { lang: string } & AvailabilityParams ): Promise<AvailabilityResponse> {
  const search = new URLSearchParams()
  search.set('lang', params.lang)
  search.set('date', params.date)
  search.set('start', params.start)
  search.set('duration', String(params.duration))
  search.set('guests', String(params.guests))

  return apiClient<AvailabilityResponse>(`/reservation/tables?${search.toString()}`)
}