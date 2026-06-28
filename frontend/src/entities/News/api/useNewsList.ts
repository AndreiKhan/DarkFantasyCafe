import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getNewsList } from './getNewsList'
import type { NewsType } from '../model/types'

export function useNewsList(type?: NewsType) {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ru'

  return useQuery({
    queryKey: ['news', lang, type],
    queryFn: () => getNewsList(lang, type),
  })
}