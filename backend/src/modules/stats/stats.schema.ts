import { z } from 'zod'

export const statsQuerySchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
})

export type StatsQuery = z.infer<typeof statsQuerySchema>
