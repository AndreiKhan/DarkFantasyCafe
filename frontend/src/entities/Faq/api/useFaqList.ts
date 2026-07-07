import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { getFaqList } from './getFaqList'

export function useFaqList() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ru'

  return useQuery({
    queryKey: ['faq', lang],
    queryFn: () => getFaqList(lang),
  })
}
