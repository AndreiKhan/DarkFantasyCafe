import type { Character } from '../model/types'
import { apiClient } from '@/shared/api'

export function getCharacters(): Promise<Character[]> {
  return apiClient<Character[]>('/character')
}
