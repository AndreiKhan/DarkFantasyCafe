import { prisma } from '../../db/prisma.js'

export const dishRepository = {
  findAll() {
    return prisma.dish.findMany({ orderBy: { createdAt: 'asc' } })
  },
}