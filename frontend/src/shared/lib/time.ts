export const WORK_START_HOUR = 12
export const WORK_END_HOUR = 23
export const WORK_END_TIME = '23:30'

export function buildTimeSlots(): string[] {
  const slots: string[] = []
  for (let hours = WORK_START_HOUR; hours <= WORK_END_HOUR; hours++) {
    slots.push(`${String(hours).padStart(2, '0')}:00`)
    slots.push(`${String(hours).padStart(2, '0')}:30`)
  }
  return slots
}

export function isWorkingSlotIso(iso: string): boolean {
  const date = new Date(iso)

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

export function workDayEnd(date: string): Date {
  return new Date(`${date}T${WORK_END_TIME}:00`)
}

export function buildStartOptionsForDate(date: string): string[] {
  const now = Date.now()
  return buildTimeSlots().filter((slot) => new Date(`${date}T${slot}:00`).getTime() > now)
}

export function buildDurationOptionsForSlot(date: string, start: string): { value: number; label: string }[] {
  const startMs = new Date(`${date}T${start}:00`).getTime()
  const endLimit = workDayEnd(date).getTime()
  const opts: { value: number; label: string }[] = []

  for (let minutes = 60; minutes <= 360; minutes += 30) {
    if (startMs + minutes * 60_000 <= endLimit) {
      opts.push({ value: minutes, label: `${minutes / 60}` })
    }
  }

  return opts
}

export type ReservationWindowIssue = 'past' | 'afterHours' | 'noSlots'

export function getReservationWindowIssue(params: {
  date: string
  start: string
  duration: number
}): ReservationWindowIssue | null {
  const starts = buildStartOptionsForDate(params.date)

  if (starts.length === 0) {
    return 'noSlots'
  }

  const startAt = new Date(`${params.date}T${params.start}:00`)

  if (startAt.getTime() <= Date.now()) {
    return 'past'
  }

  const endAt = new Date(startAt.getTime() + params.duration * 60_000)

  if (endAt.getTime() > workDayEnd(params.date).getTime()) {
    return 'afterHours'
  }

  return null
}

export function normalizeReservationParams<T extends { date: string; start: string; duration: number }>(params: T): T {
  const starts = buildStartOptionsForDate(params.date)

  const start = starts.includes(params.start) ? params.start : (starts[0] ?? params.start)

  const durations = buildDurationOptionsForSlot(params.date, start)

  const duration = durations.some((item) => item.value === params.duration)
    ? params.duration
    : (durations.at(-1)?.value ?? params.duration)

  return { ...params, start, duration }
}
