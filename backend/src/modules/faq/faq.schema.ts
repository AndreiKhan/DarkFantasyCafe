import { z } from 'zod'

export const faqCreateSchema = z.object({
  titleRu: z.string().min(1),
  titleEn: z.string().min(1),
  descriptionRu: z.string().min(1),
  descriptionEn: z.string().min(1),
})

export type FaqCreate = z.infer<typeof faqCreateSchema>

export const faqUpdateSchema = faqCreateSchema.partial()

export type FaqUpdate = z.infer<typeof faqUpdateSchema>
