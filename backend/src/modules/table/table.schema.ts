import { z } from 'zod'

export const tableCreateSchema = z.object({
  number: z.coerce.number().int().min(1),
  zoneId: z.string().uuid(),
  capacity: z.coerce.number().int().min(1),
  x: z.coerce.number().int(),
  y: z.coerce.number().int(),
  isActive: z.boolean(),
})

export type TableCreate = z.infer<typeof tableCreateSchema>

export const tableUpdateSchema = tableCreateSchema.partial()

export type TableUpdate = z.infer<typeof tableUpdateSchema>
