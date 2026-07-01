import { z } from 'zod'
import { workingDateTime } from '../../shared/schemas.js'

export const newsListQuerySchema = z.object({
  lang: z.enum(['ru', 'en']).default('ru'),
  type: z.enum(['NEWS', 'PERFORMANCE', 'MONSTER']).optional(),
})

export type NewsListQuery = z.infer<typeof newsListQuerySchema>

export const newsSlugParamSchema = z.object({
  slug: z.string().min(1),
})

export const newsCreateSchema = z.object({
  slug: z.string().min(1),
  type: z.enum(['NEWS', 'PERFORMANCE', 'MONSTER']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  titleRu: z.string().min(1),
  titleEn: z.string().min(1),
  shortDescriptionRu: z.string().min(1),
  shortDescriptionEn: z.string().min(1),
  bodyRu: z.string().min(1),
  bodyEn: z.string().min(1),
  images: z.array(z.string()).default([]),
  startsAt: workingDateTime.nullable().optional(),
  endsAt: workingDateTime.nullable().optional(),
})

export type NewsCreate = z.infer<typeof newsCreateSchema>

export const newsUpdateSchema = newsCreateSchema.partial()

export type NewsUpdate = z.infer<typeof newsUpdateSchema>
