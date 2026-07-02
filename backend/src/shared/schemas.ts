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
