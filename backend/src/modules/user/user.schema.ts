import { z } from 'zod'

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  secondName: z.string().min(1),
  phone: z.string().min(5),
  image: z.string().nullable().optional(),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
})

export type UserCreate = z.infer<typeof userCreateSchema>

export const userUpdateSchema = userCreateSchema.omit({ password: true }).partial().extend({
  removeRefreshTokenIds: z.array(z.string().uuid()).optional(),
})

export type UserUpdate = z.infer<typeof userUpdateSchema>
