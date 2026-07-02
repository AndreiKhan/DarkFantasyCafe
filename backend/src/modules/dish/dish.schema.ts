import { z } from 'zod'
import { searchQuerySchema } from '../../shared/schemas.js'

export const dishQuerySchema = searchQuerySchema.extend({
  lang: z.enum(['ru', 'en']).default('ru'),
  category: z.string().optional(),
  tags: z.string().optional().transform((s) => (s ? s.split(',') : [])),
  allergens: z.string().optional().transform((s) => (s ? s.split(',') : [])),
  sort: z.enum(['price_asc', 'price_desc']).optional(),
})

export type DishQuery = z.infer<typeof dishQuerySchema>

export const dishCreateSchema = z.object({
  nameRu: z.string().min(1),
  nameEn: z.string().min(1),
  descriptionRu: z.string().min(1),
  descriptionEn: z.string().min(1),
  price: z.coerce.number().int().min(0),
  images: z.array(z.string()).default([]),
  categoryId: z.string().uuid(),
  tagIds: z.array(z.string().uuid()).default([]),
  allergenIds: z.array(z.string().uuid()).default([]),
})

export type DishCreate = z.infer<typeof dishCreateSchema>

export const dishUpdateSchema = dishCreateSchema.partial()

export type DishUpdate = z.infer<typeof dishUpdateSchema>
