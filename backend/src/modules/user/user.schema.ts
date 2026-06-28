import { z } from 'zod'

export const newsListQuerySchema = z.object({
  lang: z.enum(['ru', 'en']).default('ru'),
  type: z.enum(['NEWS', 'PERFORMANCE', 'MONSTER']).optional(),
})

export type NewsListQuery = z.infer<typeof newsListQuerySchema>

export const newsSlugParamSchema = z.object({
  slug: z.string().min(1),
})