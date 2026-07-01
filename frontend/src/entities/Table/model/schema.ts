import { z } from 'zod'

export const tableFormSchema = z.object({
  number: z.coerce.number().int('Целое число').min(1, 'Минимум 1'),
  zoneId: z.string().min(1, 'Выберите зону'),
  capacity: z.coerce.number().int('Целое число').min(1, 'Минимум 1 место'),
  x: z.coerce.number().int('Целое число'),
  y: z.coerce.number().int('Целое число'),
  isActive: z.boolean(),
})
