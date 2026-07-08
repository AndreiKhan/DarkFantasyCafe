import { useQuery } from '@tanstack/react-query'
import { getReferenceData } from './getReferenceData'

export function useReferenceData() {
  return useQuery({
    queryKey: ['character', 'reference-data'],
    queryFn: getReferenceData,
    staleTime: Infinity,
  })
}
