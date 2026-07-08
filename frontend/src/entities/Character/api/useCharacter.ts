import { useQuery } from '@tanstack/react-query'
import { getCharacter } from './getCharacter'

export function useCharacter(id: string) {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => getCharacter(id),
    enabled: Boolean(id),
  })
}
