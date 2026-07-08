export const MAX_CHARACTER_LEVEL = 20
export const MAX_INVENTORY_ITEMS = 30
export const MAX_EQUIPMENT_ITEMS = 30

const MAX_SPELL_LEVEL_BY_CHARACTER_LEVEL: Record<number, number> = {
  1: 1,
  2: 1,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 4,
  8: 4,
  9: 5,
  10: 5,
  11: 6,
  12: 6,
  13: 7,
  14: 7,
  15: 8,
  16: 8,
  17: 9,
  18: 9,
  19: 9,
  20: 9,
}

export function getMaxSpellLevel(characterLevel: number): number {
  return MAX_SPELL_LEVEL_BY_CHARACTER_LEVEL[characterLevel] ?? 0
}
