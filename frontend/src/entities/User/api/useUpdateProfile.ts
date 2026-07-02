import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile } from './updateProfile'
import type { UpdateProfileInput } from '../model/types'

export function useUpdateProfile(userId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => updateProfile(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile', userId] }),
  })
}
