import type { DndReferenceData } from '../model/types'
import { apiClient } from '@/shared/api'

export function getReferenceData(lang: string): Promise<DndReferenceData> {
  return apiClient<DndReferenceData>(`/character/reference-data?lang=${lang}`)
}
