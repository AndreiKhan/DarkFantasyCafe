export function toDatetimeLocal(value: string | null | undefined): string {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const datePart = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Yekaterinburg',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)

  const timePart = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Yekaterinburg',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)

  return `${datePart}T${timePart}`
}

export function fromDatetimeLocal(value: string): string | null {
  if (!value) {
    return null
  }

  const date = new Date(`${value}:00+05:00`)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (value == null || value === '') {
    return '—'
  }
  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Yekaterinburg',
  })
}

export function formatReadOnlyValue(key: string, value: unknown): string {
  if (value == null || value === '') {
    return '—'
  }

  if (typeof value === 'string' && key.endsWith('At')) {
    return formatDateTime(value)
  }
  
  return String(value)
}
