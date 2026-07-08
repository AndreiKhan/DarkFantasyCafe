import { AppError } from '../../shared/AppError.js'
import { characterRepository, characterRepositoryAdmin } from './character.repository.js'
import { getDndData } from './character.reference.js'
import { getMaxSpellLevel } from './character.rules.js'
import type { CharacterCreate, CharacterUpdate, CharacterAdminCreate, CharacterAdminUpdate } from './character.schema.js'

type CharacterRuleInput = {
  race?: string | undefined
  subrace?: string | undefined
  class?: string | undefined
  subclass?: string | undefined
  background?: string | undefined
  alignment?: string | undefined
  spells?: string[] | undefined
  level?: number | undefined
}

function assertKnownIndex(validIndexes: string[], value: string | undefined, fieldName: string) {
  if (value === undefined) {
    return
  }
  if (!validIndexes.includes(value)) {
    throw AppError.badRequest(`Unknown ${fieldName}: "${value}"`, 'CHARACTER_INVALID_FIELD')
  }
}

function validateAgainstRules(input: CharacterRuleInput, level: number) {
  const dnd = getDndData()

  assertKnownIndex(dnd.races.map((r) => r.index), input.race, 'race')
  assertKnownIndex(dnd.classes.map((c) => c.index), input.class, 'class')
  assertKnownIndex(dnd.alignments.map((a) => a.index), input.alignment, 'alignment')
  assertKnownIndex(dnd.backgrounds.map((b) => b.index), input.background, 'background')

  if (input.subrace && input.race) {
    assertKnownIndex((dnd.subracesByRace[input.race] ?? []).map((s) => s.index), input.subrace, 'subrace')
  }
  if (input.subclass && input.class) {
    assertKnownIndex((dnd.subclassesByClass[input.class] ?? []).map((s) => s.index), input.subclass, 'subclass')
  }

  if (input.spells?.length) {
    const maxSpellLevel = getMaxSpellLevel(level)
    const spellByIndex = new Map(dnd.spells.map((s) => [s.index, s]))

    for (const spellIndex of input.spells) {
      const spell = spellByIndex.get(spellIndex)
      if (!spell) {
        throw AppError.badRequest(`Unknown spell: "${spellIndex}"`, 'CHARACTER_INVALID_FIELD')
      }
      if (spell.level > maxSpellLevel) {
        throw AppError.badRequest(
          `Spell "${spell.name}" needs a higher character level`,
          'CHARACTER_SPELL_LEVEL_TOO_HIGH',
        )
      }
    }
  }
}

async function requireOwnCharacter(id: string, userId: string) {
  const character = await characterRepository.findById(id)
  if (!character) {
    throw AppError.notFound('Character not found', 'CHARACTER_NOT_FOUND')
  }
  if (character.userId !== userId) {
    throw AppError.forbidden('Not your character', 'CHARACTER_FORBIDDEN')
  }
  return character
}

export const characterService = {
  getReferenceData() {
    return getDndData()
  },

  listAll() {
    return characterRepository.findAll()
  },

  listMine(userId: string) {
    return characterRepository.findByUser(userId)
  },

  async getById(id: string) {
    const character = await characterRepository.findById(id)
    if (!character) {
      throw AppError.notFound('Character not found', 'CHARACTER_NOT_FOUND')
    }
    return character
  },

  create(userId: string, input: CharacterCreate) {
    validateAgainstRules(input, input.level)
    return characterRepository.create(userId, input)
  },

  async update(id: string, userId: string, input: CharacterUpdate) {
    const existing = await requireOwnCharacter(id, userId)
    validateAgainstRules(input, input.level ?? existing.level)
    return characterRepository.update(id, input)
  },

  async remove(id: string, userId: string) {
    await requireOwnCharacter(id, userId)
    await characterRepository.remove(id)
  },
}

export const characterAdmin = {
  getAll(keywordSearch?: string) {
    return characterRepositoryAdmin.findAll(keywordSearch)
  },

  create(input: CharacterAdminCreate) {
    const { userId, ...rest } = input
    validateAgainstRules(rest, rest.level)
    return characterRepository.create(userId, rest)
  },

  async update(id: string, input: CharacterAdminUpdate) {
    const existing = await characterRepository.findById(id)
    if (!existing) {
      throw AppError.notFound('Character not found', 'CHARACTER_NOT_FOUND')
    }
    validateAgainstRules(input, input.level ?? existing.level)
    return characterRepository.update(id, input)
  },

  async remove(id: string) {
    const existing = await characterRepository.findById(id)
    if (!existing) {
      throw AppError.notFound('Character not found', 'CHARACTER_NOT_FOUND')
    }
    await characterRepository.remove(id)
  },
}
