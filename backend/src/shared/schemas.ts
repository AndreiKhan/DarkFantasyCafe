import { z } from 'zod'

export const langSchema = z.object({
  lang: z.enum(['ru', 'en']).default('ru'),
})
export type LangQuery = z.infer<typeof langSchema>

export const idParamSchema = z.object({
  id: z.string().uuid()
})

export const searchQuerySchema = z.object({
  keywordSearch: z.string().trim().optional(),
})
export type SearchQuery = z.infer<typeof searchQuerySchema>

export const PHONE_REGEX = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/
export const optionalPhone = z.union([z.string().regex(PHONE_REGEX, 'Телефон в формате +7 (999) 123-45-67'), z.literal('')]).optional()

export const WORK_START_HOUR = 12
export const WORK_END_HOUR = 23
export const WORK_END_TIME = '23:30'

export function isWorkingSlot(date: Date): boolean {
  if (Number.isNaN(date.getTime())) {
    return false
  }

  if (date.getSeconds() !== 0 || date.getMilliseconds() !== 0) {
    return false
  }

  const minutes = date.getMinutes()

  if (minutes !== 0 && minutes !== 30) {
    return false
  }
  
  const minutesOfDay = date.getHours() * 60 + minutes

  return minutesOfDay >= WORK_START_HOUR * 60 && minutesOfDay <= WORK_END_HOUR * 60 + 30
}

export const workingDateTime = z.coerce.date().refine(isWorkingSlot, 'Time must be within working hours (12:00–23:30) in 30-minute steps')

export function buildReservationWindow(date: string, start: string, durationMinutes: number) {
  const startsAt = new Date(`${date}T${start}:00`)
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60 * 1000)
  return { startsAt, endsAt }
}

export function workDayEnd(date: string): Date {
  return new Date(`${date}T${WORK_END_TIME}:00`)
}

export type ReservationWindowErrorCode =
  | 'TIME_NOT_ALIGNED'
  | 'RESERVATION_IN_PAST'
  | 'INVALID_TIME_RANGE'
  | 'RESERVATION_END_AFTER_HOURS'

export function getPublicReservationWindowError(
  startsAt: Date,
  endsAt: Date,
): { code: ReservationWindowErrorCode; message: string } | null {
  if (!isWorkingSlot(startsAt)) {
    return { code: 'TIME_NOT_ALIGNED', message: 'Time must be aligned to working hours' }
  }

  if (startsAt.getTime() <= Date.now()) {
    return { code: 'RESERVATION_IN_PAST', message: 'Reservation time is in the past' }
  }

  if (endsAt <= startsAt) {
    return { code: 'INVALID_TIME_RANGE', message: 'End time must be after start time' }
  }

  const dateKey = `${startsAt.getFullYear()}-${String(startsAt.getMonth() + 1).padStart(2, '0')}-${String(startsAt.getDate()).padStart(2, '0')}`
  if (endsAt.getTime() > workDayEnd(dateKey).getTime()) {
    return { code: 'RESERVATION_END_AFTER_HOURS', message: 'Reservation ends after working hours' }
  }

  return null
}
