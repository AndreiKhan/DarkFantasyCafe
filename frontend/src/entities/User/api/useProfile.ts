import { useQuery } from '@tanstack/react-query'
import { getProfile } from './getProfile'

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId),
    enabled: Boolean(userId),
    retry: false,
  })
}