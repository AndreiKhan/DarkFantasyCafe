import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getDishFilters } from './getDishFilters'

export function useDishFilters() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ru'

  return useQuery({
    queryKey: ['dish-filters', lang],
    queryFn: () => getDishFilters(lang),
  })
}