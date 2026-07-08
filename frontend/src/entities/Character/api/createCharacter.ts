import type { Character, CreateCharacterInput } from '../model/types'
import { apiClient } from '@/shared/api'

export function createCharacter(input: CreateCharacterInput): Promise<Character> {
  return apiClient<Character>('/character', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
