import { useQuery } from '@tanstack/react-query'
import { getMyCharacters } from './getMyCharacters'

export function useMyCharacters(enabled = true) {
  return useQuery({
    queryKey: ['characters', 'mine'],
    queryFn: getMyCharacters,
    enabled,
  })
}
