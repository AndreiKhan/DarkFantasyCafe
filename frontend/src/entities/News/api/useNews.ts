import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getNews } from './getNews'

export function useNews(slug: string) {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ru'

  return useQuery({
    queryKey: ['news', slug, lang],
    queryFn: () => getNews(slug, lang),
    enabled: !!slug,
  })
}