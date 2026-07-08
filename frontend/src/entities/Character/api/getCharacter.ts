import type { Character } from '../model/types'
import { apiClient } from '@/shared/api'

export function getCharacter(id: string): Promise<Character> {
  return apiClient<Character>(`/character/${id}`)
}
