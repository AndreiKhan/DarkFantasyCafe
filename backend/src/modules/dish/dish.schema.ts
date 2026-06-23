import { z } from 'zod'

export const dishQuerySchema = z.object({
  lang: z.enum(['ru', 'en']).default('ru'),
  category: z.string().optional(),
  tags: z.string().optional().transform((s) => (s ? s.split(',') : [])),
  allergens: z.string().optional().transform((s) => (s ? s.split(',') : [])),
  sort: z.enum(['price_asc', 'price_desc']).optional(),
})

export type DishQuery = z.infer<typeof dishQuerySchema>

export const langSchema = z.object({
  lang: z.enum(['ru', 'en']).default('ru'),
})

export type LangQuery = z.infer<typeof langSchema>