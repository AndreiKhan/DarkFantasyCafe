import { prisma } from '../../db/prisma.js'

export const achievementRepository = {
  findPublishedByCode(code: string) {
    return prisma.achievements.findFirst({
      where: { code, status: 'PUBLISHED' },
    })
  },

  async userHasAchievement(userId: string, achievementId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { achievements: { where: { id: achievementId }, select: { id: true } } },
    })
    return Boolean(user?.achievements.length)
  },

  grant(userId: string, achievementId: string, bonuses: number) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        bonuses: { increment: bonuses },
        achievements: { connect: { id: achievementId } },
      },
    })
  },
}
