import { prisma } from '../../db/prisma.js'
import type { ContactRequestCreate } from './contactRequest.schema.js'

export const contactRequestRepository = {
  create(data: ContactRequestCreate) {
    return prisma.contactRequest.create({ data })
  },
}

export const contactRequestRepositoryAdmin = {
  findAll(keywordSearch?: string) {
    return prisma.contactRequest.findMany({
      where: keywordSearch
        ? {
            OR: [
              { contact: { contains: keywordSearch, mode: 'insensitive' } },
              { message: { contains: keywordSearch, mode: 'insensitive' } },
            ],
          }
        : {},
      orderBy: { createdAt: 'desc' },
    })
  },

  findById(id: string) {
    return prisma.contactRequest.findUnique({ where: { id } })
  },

  remove(id: string) {
    return prisma.contactRequest.delete({ where: { id } })
  },
}
