import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getDishes } from './getDishes'
import type { DishFilters } from '../model/types'

export function useDishes(filters: DishFilters) {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ru'

  return useQuery({
    queryKey: ['dishes', lang, filters],
    queryFn: () => getDishes({ lang, ...filters }),
  })
}