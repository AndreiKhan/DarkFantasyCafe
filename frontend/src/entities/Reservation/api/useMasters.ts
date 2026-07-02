import { useQuery } from '@tanstack/react-query'
import { getMasters } from './getMasters'
import type { AdminMastersParams, MastersParams } from '../model/types'

export function useMasters(
  params: MastersParams | AdminMastersParams,
  enabled = true,
) {
  return useQuery({
    queryKey: ['masters', params],
    queryFn: () => getMasters(params),
    enabled,
    placeholderData: (prev) => prev,
  })
}
