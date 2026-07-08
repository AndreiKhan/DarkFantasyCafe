import { prisma } from '../../db/prisma.js'
import type { CharacterCreate, CharacterUpdate } from './character.schema.js'

function omitUndefined<T extends object>(input: T): T {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined)) as T
}

export const characterRepository = {
  findAll() {
    return prisma.character.findMany({ orderBy: { createdAt: 'desc' } })
  },

  findByUser(userId: string) {
    return prisma.character.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  },

  findById(id: string) {
    return prisma.character.findUnique({ where: { id } })
  },

  create(userId: string, input: CharacterCreate) {
    return prisma.character.create({ data: { ...omitUndefined(input), userId } })
  },

  update(id: string, input: CharacterUpdate & { userId?: string | undefined }) {
    return prisma.character.update({ where: { id }, data: omitUndefined(input) })
  },

  remove(id: string) {
    return prisma.character.delete({ where: { id } })
  },
}

export const characterRepositoryAdmin = {
  findAll(keywordSearch?: string) {
    return prisma.character.findMany({
      where: keywordSearch ? { name: { contains: keywordSearch, mode: 'insensitive' } } : {},
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, email: true, firstName: true, secondName: true } } },
    })
  },
}
