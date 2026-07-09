export type AchievementRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'

export interface UnlockedAchievement {
  id: string
  code: string
  name: string
  howToGet: string
  bonuses: number
  rarity: AchievementRarity[]
}

export interface AchievementEventResult {
  unlocked: boolean
  achievement: UnlockedAchievement | null
}
