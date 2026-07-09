import { achievementRepository } from './achievement.repository.js'

export const achievementService = {
  async unlock(userId: string, code: string) {
    const achievement = await achievementRepository.findPublishedByCode(code)
    if (!achievement) {
      return null
    }

    const alreadyHas = await achievementRepository.userHasAchievement(userId, achievement.id)
    if (alreadyHas) {
      return null
    }

    await achievementRepository.grant(userId, achievement.id, achievement.bonuses)
    return achievement
  },
}
