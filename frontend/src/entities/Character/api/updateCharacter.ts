import type { Character, UpdateCharacterInput } from '../model/types'
import { apiClient } from '@/shared/api'

export function updateCharacter({ id, ...patch }: UpdateCharacterInput): Promise<Character> {
  return apiClient<Character>(`/character/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}
