import type { AdminMastersParams, MastersParams, MastersResponse } from '../model/types'
import { apiClient } from '@/shared/api'

export function getMasters(params: MastersParams): Promise<MastersResponse>
export function getMasters(params: AdminMastersParams): Promise<MastersResponse>
export function getMasters(params: MastersParams | AdminMastersParams): Promise<MastersResponse> {
  if ('startsAt' in params) {
    const search = new URLSearchParams({ startsAt: params.startsAt, endsAt: params.endsAt })
    if (params.excludeId) {
      search.set('excludeId', params.excludeId)
    }
    return apiClient(`/admin/reservation/masters?${search}`)
  }

  const search = new URLSearchParams({
    date: params.date,
    start: params.start,
    duration: String(params.duration),
  })
  return apiClient(`/reservation/masters?${search}`)
}
