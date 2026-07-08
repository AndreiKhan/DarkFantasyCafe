import type { NamedEntry } from './types'

export function lookupName(entries: NamedEntry[], index: string | null | undefined): string {
  if (!index) {
    return ''
  }
  return entries.find((entry) => entry.index === index)?.name ?? index
}
