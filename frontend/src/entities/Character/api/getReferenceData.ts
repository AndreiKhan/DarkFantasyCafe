import type { DndReferenceData } from '../model/types'
import { apiClient } from '@/shared/api'

export function getReferenceData(): Promise<DndReferenceData> {
  return apiClient<DndReferenceData>('/character/reference-data')
}
