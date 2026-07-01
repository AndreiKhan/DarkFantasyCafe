export const WORK_START_HOUR = 12
export const WORK_END_HOUR = 23

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
