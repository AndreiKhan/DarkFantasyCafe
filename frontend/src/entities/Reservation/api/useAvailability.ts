import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getAvailability } from './getAvailability'
import type { AvailabilityParams } from '../model/types'

export function useAvailability(params: AvailabilityParams) {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ru'

  return useQuery({
    queryKey: ['availability', lang, params],
    queryFn: () => getAvailability({ lang, ...params }),
    placeholderData: (prev) => prev,
  })
}