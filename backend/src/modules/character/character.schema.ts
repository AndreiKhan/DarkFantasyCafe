import { z } from 'zod'
import { MAX_CHARACTER_LEVEL, MAX_EQUIPMENT_ITEMS, MAX_INVENTORY_ITEMS } from './character.rules.js'

const abilityScore = z.coerce.number().int().min(1).max(20)

export const characterCreateSchema = z.object({
  name: z.string().trim().min(1).max(60),
  level: z.coerce.number().int().min(1).max(MAX_CHARACTER_LEVEL),
  bio: z.string().max(2000).optional(),
  class: z.string().min(1),
  subclass: z.string().optional(),
  race: z.string().min(1),
  subrace: z.string().optional(),
  background: z.string().min(1),
  alignment: z.string().min(1),
  avatar: z.string().optional(),
  appearance: z.string().max(1000).optional(),
  strength: abilityScore,
  dexterity: abilityScore,
  constitution: abilityScore,
  intelligence: abilityScore,
  wisdom: abilityScore,
  charisma: abilityScore,
  hitPoints: z.coerce.number().int().min(0).optional(),
  armorClass: z.coerce.number().int().min(0).optional(),
  speed: z.coerce.number().int().min(0).optional(),
  spells: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  equipment: z.array(z.string()).max(MAX_EQUIPMENT_ITEMS).optional(),
  inventory: z.array(z.string()).max(MAX_INVENTORY_ITEMS).optional(),
})

export type CharacterCreate = z.infer<typeof characterCreateSchema>

export const characterUpdateSchema = characterCreateSchema.partial()

export type CharacterUpdate = z.infer<typeof characterUpdateSchema>

export const characterAdminCreateSchema = characterCreateSchema.extend({
  userId: z.string().uuid(),
})

export type CharacterAdminCreate = z.infer<typeof characterAdminCreateSchema>

export const characterAdminUpdateSchema = characterAdminCreateSchema.partial()

export type CharacterAdminUpdate = z.infer<typeof characterAdminUpdateSchema>
