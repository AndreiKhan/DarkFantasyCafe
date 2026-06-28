import { useQuery } from '@tanstack/react-query'
import { getMe } from './getMe'

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false,
  })
}
