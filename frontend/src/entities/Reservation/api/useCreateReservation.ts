import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { createReservation } from './createReservation'
import type { CreateReservation } from '../model/types'

export function useCreateReservation() {
  const { i18n } = useTranslation()
  const lang = i18n.language === 'en' ? 'en' : 'ru'

  return useMutation({
    mutationFn: (input: CreateReservation) => createReservation({ lang, ...input }),
  })
}