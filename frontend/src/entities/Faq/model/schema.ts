import { z } from 'zod'

export const faqFormSchema = z.object({
  titleRu: z.string().min(1, 'Заголовок обязателен'),
  titleEn: z.string().min(1, 'Title is required'),
  descriptionRu: z.string().min(1, 'Описание обязательно'),
  descriptionEn: z.string().min(1, 'Description is required'),
})
