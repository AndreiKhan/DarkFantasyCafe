import type { CharacterAdmin, UpdateCharacterAdminInput } from '../model/types'
import { apiClient } from '@/shared/api'

export function updateCharacterAdmin({ id, ...patch }: UpdateCharacterAdminInput): Promise<CharacterAdmin> {
  return apiClient<CharacterAdmin>(`/admin/character/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}
