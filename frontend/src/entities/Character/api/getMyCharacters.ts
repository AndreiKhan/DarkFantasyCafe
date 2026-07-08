import type { Character } from '../model/types'
import { apiClient } from '@/shared/api'

export function getMyCharacters(): Promise<Character[]> {
  return apiClient<Character[]>('/character/mine')
}
