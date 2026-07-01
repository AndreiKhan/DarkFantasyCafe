export function toDatetimeLocal(value: string | null | undefined): string {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const offsetMs = date.getTimezoneOffset() * 60 * 1000

  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

export function fromDatetimeLocal(value: string): string | null {
  if (!value) {
    return null
  }

  const date = new Date(value)

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
