import { z } from 'zod'

export const contactRequestCreateSchema = z.object({
  contact: z.string().min(1),
  message: z.string().min(1),
})

export type ContactRequestCreate = z.infer<typeof contactRequestCreateSchema>
