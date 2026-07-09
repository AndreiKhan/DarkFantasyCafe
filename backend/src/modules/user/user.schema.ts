import { z } from 'zod'
import { optionalPhone, PHONE_REGEX } from '../../shared/schemas.js'

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  secondName: z.string().min(1),
  phone: optionalPhone,
  image: z.string().nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  role: z.enum(['USER', 'ADMIN', 'MASTER']).default('USER'),
})

export type UserCreate = z.infer<typeof userCreateSchema>

export const userUpdateSchema = userCreateSchema.omit({ password: true }).partial().extend({
  removeRefreshTokenIds: z.array(z.string().uuid()).optional(),
})

export type UserUpdate = z.infer<typeof userUpdateSchema>

export const userSelfUpdateSchema = z.object({
  firstName: z.string().min(1),
  secondName: z.string().min(1),
  email: z.string().email(),
  phone: z.union([z.string().regex(PHONE_REGEX, 'Телефон в формате +7 (999) 123-45-67'), z.literal('')]),
  image: z.string().nullable(),
  bio: z.string().max(500).nullable(),
}).partial()

export type UserSelfUpdate = z.infer<typeof userSelfUpdateSchema>

export const verifyPasswordSchema = z.object({
  password: z.string().min(1),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
})

export type VerifyPasswordInput = z.infer<typeof verifyPasswordSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>