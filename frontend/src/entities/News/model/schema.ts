import { z } from 'zod'
import { isWorkingSlotIso } from '@/shared/lib/time'

const workingSlot = z
  .string()
  .nullable()
  .refine((v) => v === null || isWorkingSlotIso(v), 'Только рабочие часы (12:00–23:30), шаг 30 минут')

export const newsFormSchema = z.object({
  slug: z.string().min(1, 'Укажите slug').regex(/^[a-z0-9-]+$/, 'Только латиница, цифры и дефис'),
  type: z.enum(['NEWS', 'PERFORMANCE', 'MONSTER']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  titleRu: z.string().min(1, 'Заголовок обязателен'),
  titleEn: z.string().min(1, 'Title is required'),
  shortDescriptionRu: z.string().min(1, 'Укажите краткое описание'),
  shortDescriptionEn: z.string().min(1, 'Enter short description'),
  bodyRu: z.string().min(1, 'Текст обязателен'),
  bodyEn: z.string().min(1, 'Body is required'),
  images: z.array(z.string()),
  startsAt: workingSlot,
  endsAt: workingSlot,
})
