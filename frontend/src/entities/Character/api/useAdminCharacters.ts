import { useQuery } from '@tanstack/react-query'
import { getAdminCharacters } from './getAdminCharacters'

export function useAdminCharacters(keywordSearch?: string) {
  return useQuery({
    queryKey: ['adminCharacters', keywordSearch ?? ''],
    queryFn: () => getAdminCharacters(keywordSearch),
    placeholderData: (prev) => prev,
  })
}
