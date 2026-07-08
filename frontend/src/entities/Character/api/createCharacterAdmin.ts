import type { CharacterAdmin, CreateCharacterAdminInput } from '../model/types'
import { apiClient } from '@/shared/api'

export function createCharacterAdmin(input: CreateCharacterAdminInput): Promise<CharacterAdmin> {
  return apiClient<CharacterAdmin>('/admin/character', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
