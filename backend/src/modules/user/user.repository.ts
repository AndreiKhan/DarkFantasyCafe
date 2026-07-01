import { prisma } from '../../db/prisma.js'
import type { Prisma } from '../../../generated/prisma/index.js'

const safeSelect = {
  id: true,
  email: true,
  firstName: true,
  secondName: true,
  phone: true,
  image: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  refreshTokens: {
    select: { id: true, createdAt: true, expiresAt: true },
    orderBy: { createdAt: 'desc' },
  },
} satisfies Prisma.UserSelect

export const userRepository = {
  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        secondName: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
      },
    })
  },
}

export const userRepositoryAdmin = {
  findAll() {
    return prisma.user.findMany({ orderBy: { createdAt: 'desc' }, select: safeSelect })
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: safeSelect })
  },

  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data, select: safeSelect })
  },

  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data, select: safeSelect })
  },

  remove(id: string) {
    return prisma.user.delete({ where: { id } })
  },
}
