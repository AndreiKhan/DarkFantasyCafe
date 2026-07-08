export interface NamedEntry {
  index: string
  name: string
}

export interface SpellEntry extends NamedEntry {
  level: number
}

export interface DndReferenceData {
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

export interface Character {
  id: string
  userId: string
  name: string
  level: number
  bio: string | null
  class: string
  subclass: string | null
  race: string
  subrace: string | null
  background: string
  alignment: string
  avatar: string | null
  appearance: string | null
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  hitPoints: number | null
  armorClass: number | null
  speed: number | null
  spells: string[]
  languages: string[]
  skills: string[]
  equipment: string[]
  inventory: string[]
  createdAt: string
  updatedAt: string
}

export type CreateCharacterInput = Omit<Character, 'id' | 'userId' | 'createdAt' | 'updatedAt'>

export type UpdateCharacterInput = Partial<CreateCharacterInput> & { id: string }

export interface CharacterAdmin extends Character {
  user: { id: string; email: string; firstName: string; secondName: string }
}

export type CreateCharacterAdminInput = CreateCharacterInput & { userId: string }

export type UpdateCharacterAdminInput = Partial<CreateCharacterAdminInput> & { id: string }
