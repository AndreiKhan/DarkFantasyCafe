import { z } from 'zod'
import { optionalPhone } from '../../shared/schemas.js'

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  secondName: z.string().min(1),
  phone: optionalPhone,
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>