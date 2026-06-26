import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { apiClient } from '@/shared/api'
import type { ReservationSummary } from '../model/types'

export function useReservationStatus(id: string) {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ru'

  return useQuery({
    queryKey: ['reservation-status', id, lang],
    queryFn: () => apiClient<ReservationSummary>(`/reservation/${id}/status?lang=${lang}`),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'CONFIRMED' || status === 'CANCELLED' ? false : 2000
    },
  })
}