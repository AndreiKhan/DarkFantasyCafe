import { prisma } from '../../db/prisma.js'

export const refreshTokenRepository = {
  create(userId: string, tokenHash: string, expiresAt: Date) {
    return prisma.refreshToken.create({ data: { userId, tokenHash, expiresAt } })
  },
  
  findByHash(tokenHash: string) {
    return prisma.refreshToken.findUnique({ where: { tokenHash } })
  },

  deleteByHash(tokenHash: string) {
    return prisma.refreshToken.deleteMany({ where: { tokenHash } })
  },

  deleteByUser(userId: string) {
    return prisma.refreshToken.deleteMany({ where: { userId } })
  },
}