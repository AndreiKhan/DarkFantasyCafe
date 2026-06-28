import { useQuery } from '@tanstack/react-query'
import { getProfile } from './getProfile'

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    retry: false,
  })
}