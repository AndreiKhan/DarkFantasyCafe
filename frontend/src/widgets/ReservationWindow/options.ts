import {
  buildDurationOptionsForSlot,
  buildStartOptionsForDate,
} from '@/shared/lib/time'

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export { buildStartOptionsForDate, buildDurationOptionsForSlot }

export function buildStartOptions(from = 12, to = 23): string[] {
  const slots: string[] = []

  for (let hours = from; hours <= to; hours++) {
    slots.push(`${String(hours).padStart(2, '0')}:00`)
    slots.push(`${String(hours).padStart(2, '0')}:30`)
  }

  return slots
}

export function buildDurationOptions(): { value: number; label: string }[] {
  const opts: { value: number; label: string }[] = []

  for (let minutes = 60; minutes <= 360; minutes += 30) {
    opts.push({
      value: minutes,
      label: `${minutes / 60}`,
    })
  }

  return opts
}
