import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getReferenceData } from './getReferenceData'

export function useReferenceData() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ru'

  return useQuery({
    queryKey: ['character', 'reference-data', lang],
    queryFn: () => getReferenceData(lang),
    staleTime: Infinity,
  })
}
