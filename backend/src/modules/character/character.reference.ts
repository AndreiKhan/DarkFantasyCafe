import { readFileSync } from 'node:fs'

export type Lang = 'ru' | 'en'

export type NamedEntry = { index: string; name: string }
export type SpellEntry = { index: string; name: string; level: number }

export type DndData = {
  races: NamedEntry[]
  subracesByRace: Record<string, NamedEntry[]>
  classes: NamedEntry[]
  subclassesByClass: Record<string, NamedEntry[]>
  alignments: NamedEntry[]
  backgrounds: NamedEntry[]
  languages: NamedEntry[]
  skills: NamedEntry[]
  spells: SpellEntry[]
}

const dataDir = new URL('./data/', import.meta.url)
const cache = new Map<Lang, DndData>()

function readDataFile(lang: Lang): DndData {
  return JSON.parse(readFileSync(new URL(`dnd-data-${lang}.json`, dataDir), 'utf-8'))
}

export function getDndData(lang: Lang): DndData {
  const cached = cache.get(lang)
  if (cached) {
    return cached
  }

  const data = lang === 'en' ? readDataFile('en') : (tryReadDataFile(lang) ?? readDataFile('en'))
  cache.set(lang, data)
  return data
}

function tryReadDataFile(lang: Lang): DndData | null {
  try {
    return readDataFile(lang)
  } catch {
    return null
  }
}
