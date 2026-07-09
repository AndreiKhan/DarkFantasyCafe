import { prisma } from '../../db/prisma.js'
import type { Prisma } from '../../../generated/prisma/client.js'

const achievementsSelect = {
  achievements: {
    select: { id: true, nameRu: true, nameEn: true, bonuses: true, rarity: true },
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
        bio: true,
        bonuses: true,
        role: true,
        createdAt: true,
        ...achievementsSelect,
      },
    })
  },

  findByPublicId(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        secondName: true,
        image: true,
        bio: true,
        createdAt: true,
        ...achievementsSelect,
      },
    })
  },

  updateProfile(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        secondName: true,
        phone: true,
        image: true,
        bio: true,
        bonuses: true,
        role: true,
        createdAt: true,
      },
    })
  },

  findPasswordHash(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { passwordHash: true },
    })
  },

  updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
      select: { id: true },
    })
  },
}

const safeSelect = {
  id: true,
  email: true,
  firstName: true,
  secondName: true,
  phone: true,
  image: true,
  bio: true,
  bonuses: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  refreshTokens: {
    select: { id: true, createdAt: true, expiresAt: true },
    orderBy: { createdAt: 'desc' },
  },
  characters: true,
  achievements: true,
} satisfies Prisma.UserSelect

export const userRepositoryAdmin = {
  findAll(keywordSearch?: string) {
    return prisma.user.findMany({
      where: keywordSearch
        ? {
            OR: [
              { email: { contains: keywordSearch, mode: 'insensitive' } },
              { firstName: { contains: keywordSearch, mode: 'insensitive' } },
              { secondName: { contains: keywordSearch, mode: 'insensitive' } },
              { phone: { contains: keywordSearch, mode: 'insensitive' } },
              { bio: { contains: keywordSearch, mode: 'insensitive' } },
            ],
          }
        : {},
      orderBy: { createdAt: 'desc' },
      select: safeSelect,
    })
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
