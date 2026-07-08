import { z } from 'zod'
import type { TFunction } from 'i18next'
import { MAX_CHARACTER_LEVEL, MAX_EQUIPMENT_ITEMS, MAX_INVENTORY_ITEMS } from './rules'

const optionalInt = z.preprocess(
  (value) => (value === '' || value === undefined ? undefined : value),
  z.coerce.number().int().min(0).optional(),
)

export const createCharacterFormSchema = (t: TFunction) => {
  const abilityScore = z.coerce.number().int().min(1, t('errors:validation.characterAbilityRange')).max(20, t('errors:validation.characterAbilityRange'))

  return z.object({
    name: z.string().trim().min(1, t('errors:validation.characterNameRequired')),
    level: z.coerce.number().int().min(1, t('errors:validation.characterLevelRange', { max: MAX_CHARACTER_LEVEL })).max(MAX_CHARACTER_LEVEL, t('errors:validation.characterLevelRange', { max: MAX_CHARACTER_LEVEL })),
    bio: z.string().optional(),
    class: z.string().min(1, t('errors:validation.characterClassRequired')),
    subclass: z.string().optional(),
    race: z.string().min(1, t('errors:validation.characterRaceRequired')),
    subrace: z.string().optional(),
    background: z.string().min(1, t('errors:validation.characterBackgroundRequired')),
    alignment: z.string().min(1, t('errors:validation.characterAlignmentRequired')),
    avatar: z.string().optional(),
    appearance: z.string().optional(),
    strength: abilityScore,
    dexterity: abilityScore,
    constitution: abilityScore,
    intelligence: abilityScore,
    wisdom: abilityScore,
    charisma: abilityScore,
    hitPoints: optionalInt,
    armorClass: optionalInt,
    speed: optionalInt,
    spells: z.array(z.string()).default([]),
    languages: z.array(z.string()).default([]),
    skills: z.array(z.string()).default([]),
    equipment: z.array(z.string()).max(MAX_EQUIPMENT_ITEMS).default([]),
    inventory: z.array(z.string()).max(MAX_INVENTORY_ITEMS).default([]),
  })
}
