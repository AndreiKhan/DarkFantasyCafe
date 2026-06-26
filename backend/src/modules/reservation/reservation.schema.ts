import { z } from 'zod'

export const tablesQuerySchema = z.object({
  lang: z.enum(['ru', 'en']).default('ru'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start: z.string().regex(/^([01]\d|2[0-3]):(00|30)$/),
  duration: z.coerce.number().int().min(60).max(360).refine((m) => m % 30 === 0, 'Duration must be a multiple of 30'),
  guests: z.coerce.number().int().min(1).default(1),
})

export type TablesQuery = z.infer<typeof tablesQuerySchema>

export const createReservationSchema = z.object({
  lang: z.enum(['ru', 'en']).default('ru'),
  tableId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start: z.string().regex(/^([01]\d|2[0-3]):(00|30)$/),
  duration: z.coerce.number().int().min(60).max(360).refine((m) => m % 30 === 0, 'Duration must be a multiple of 30'),
  guests: z.coerce.number().int().min(1),
  dishes: z.array(z.object({
    dishId: z.string().uuid(),
    quantity: z.number().int().min(1).max(10)
  }))
  .default([]),
})

export type CreateReservationInput = z.infer<typeof createReservationSchema>