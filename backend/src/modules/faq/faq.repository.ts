import { prisma } from '../../db/prisma.js'
import type { Prisma } from '../../../generated/prisma/index.js'

export const faqRepository = {
  findAll() {
    return prisma.faq.findMany({ orderBy: { createdAt: 'asc' } })
  },
}

export const faqRepositoryAdmin = {
  findAll(keywordSearch?: string) {
    return prisma.faq.findMany({
      where: keywordSearch
        ? {
            OR: [
              { titleRu: { contains: keywordSearch, mode: 'insensitive' } },
              { titleEn: { contains: keywordSearch, mode: 'insensitive' } },
              { descriptionRu: { contains: keywordSearch, mode: 'insensitive' } },
              { descriptionEn: { contains: keywordSearch, mode: 'insensitive' } },
            ],
          }
        : {},
      orderBy: { createdAt: 'asc' },
    })
  },

  findById(id: string) {
    return prisma.faq.findUnique({ where: { id } })
  },

  create(data: Prisma.FaqCreateInput) {
    return prisma.faq.create({ data })
  },

  update(id: string, data: Prisma.FaqUpdateInput) {
    return prisma.faq.update({ where: { id }, data })
  },

  remove(id: string) {
    return prisma.faq.delete({ where: { id } })
  },
}
