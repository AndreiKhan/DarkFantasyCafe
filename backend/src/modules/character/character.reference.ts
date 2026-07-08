import { readFileSync } from 'node:fs'

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
let cache: DndData | null = null

function readDataFile(): DndData {
  return JSON.parse(readFileSync(new URL('dnd-data-en.json', dataDir), 'utf-8'))
}

export function getDndData(): DndData {
  if (cache) {
    return cache
  }

  cache = readDataFile()
  return cache
}
