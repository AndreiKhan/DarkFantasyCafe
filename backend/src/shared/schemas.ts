import { z } from 'zod'

export const langSchema = z.object({
  lang: z.enum(['ru', 'en']).default('ru'),
})
export type LangQuery = z.infer<typeof langSchema>

export const idParamSchema = z.object({
  id: z.string().uuid()
})