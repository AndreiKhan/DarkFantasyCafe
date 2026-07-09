import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getMyReservations } from './getMyReservations'

export function useMyReservations(enabled = true) {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ru'

  return useQuery({
    queryKey: ['reservation', 'mine', lang],
    queryFn: () => getMyReservations(lang),
    enabled,
  })
}
