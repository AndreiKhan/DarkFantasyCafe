import { z } from 'zod'
import { workingDateTime } from '../../shared/schemas.js'

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const start = z.string().regex(/^([01]\d|2[0-3]):(00|30)$/)
const duration = z.coerce.number().int().min(60).max(360).refine((m) => m % 30 === 0, 'Duration must be a multiple of 30')

export const masterSessionTypeSchema = z.enum(['ONESHOT', 'CAMPAIGN'])
export type MasterSessionType = z.infer<typeof masterSessionTypeSchema>

const masterFields = {
  masterId: z.string().uuid().nullable().optional(),
  masterSessionType: masterSessionTypeSchema.nullable().optional(),
}

const dishLine = z.object({
  dishId: z.string().uuid(),
  quantity: z.coerce.number().int().min(1).max(10),
})

const masterCheck = {
  message: 'Выберите тип истории',
  path: ['masterSessionType'],
}

function hasMasterSessionType(data: { masterId?: string | null; masterSessionType?: MasterSessionType | null }) {
  return !data.masterId || data.masterSessionType
}

export const tablesQuerySchema = z.object({
  lang: z.enum(['ru', 'en']).default('ru'),
  date,
  start,
  duration,
  guests: z.coerce.number().int().min(1).default(1),
})

export type TablesQuery = z.infer<typeof tablesQuerySchema>

export const mastersQuerySchema = z.object({ date, start, duration })
export type MastersQuery = z.infer<typeof mastersQuerySchema>

export const adminMastersQuerySchema = z.object({
  startsAt: workingDateTime,
  endsAt: workingDateTime,
  excludeId: z.string().uuid().optional(),
})
export type AdminMastersQuery = z.infer<typeof adminMastersQuerySchema>

const publicReservation = z.object({
  lang: z.enum(['ru', 'en']).default('ru'),
  tableId: z.string().uuid(),
  ...masterFields,
  date,
  start,
  duration,
  guests: z.coerce.number().int().min(1),
  dishes: z.array(dishLine).default([]),
})

const adminReservation = z.object({
  userId: z.string().uuid(),
  tableId: z.string().uuid(),
  ...masterFields,
  startsAt: workingDateTime,
  endsAt: workingDateTime,
  guests: z.coerce.number().int().min(1),
  status: z.enum(['DRAFT', 'PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED']),
  totalAmount: z.coerce.number().int().min(0),
  dishes: z.array(dishLine).default([]),
})

export const createReservationSchema = publicReservation.refine(hasMasterSessionType, masterCheck)
export type CreateReservation = z.infer<typeof publicReservation>

export const reservationCreateSchema = adminReservation.refine(hasMasterSessionType, masterCheck)
export type ReservationCreate = z.infer<typeof adminReservation>

const adminReservationPartial = adminReservation.partial()

export const reservationUpdateSchema = adminReservationPartial.refine(hasMasterSessionType, masterCheck)
export type ReservationUpdate = z.infer<typeof adminReservationPartial>
