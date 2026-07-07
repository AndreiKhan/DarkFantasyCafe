import { z } from 'zod'
import type { TFunction } from 'i18next'

export const createContactRequestFormSchema = (t: TFunction) => z.object({
  contact: z.string().min(1, t('errors:validation.contactRequired')),
  message: z.string().min(1, t('errors:validation.messageRequired')),
})
