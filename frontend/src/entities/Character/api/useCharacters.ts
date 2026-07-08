import { useQuery } from '@tanstack/react-query'
import { getCharacters } from './getCharacters'

export function useCharacters() {
  return useQuery({
    queryKey: ['characters'],
    queryFn: getCharacters,
  })
}
