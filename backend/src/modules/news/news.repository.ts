import { prisma } from '../../db/prisma.js'
import type { NewsType, Prisma } from '../../../generated/prisma/index.js'

export const newsRepository = {
  findPublished(type?: NewsType) {
    return prisma.news.findMany({
      where: {
        status: 'PUBLISHED',
        ...(type ? { type } : {}),
      },
      orderBy: { publishedAt: 'desc' },
    })
  },

  findPublishedBySlug(slug: string) {
    return prisma.news.findFirst({
      where: {
        slug,
        status: 'PUBLISHED'
      },
    })
  },
}

export const newsRepositoryAdmin = {
  findAll() {
    return prisma.news.findMany({ orderBy: { createdAt: 'desc' } })
  },

  findById(id: string) {
    return prisma.news.findUnique({ where: { id } })
  },

  findBySlug(slug: string) {
    return prisma.news.findUnique({ where: { slug } })
  },

  create(data: Prisma.NewsCreateInput) {
    return prisma.news.create({ data })
  },

  update(id: string, data: Prisma.NewsUpdateInput) {
    return prisma.news.update({ where: { id }, data })
  },

  remove(id: string) {
    return prisma.news.delete({ where: { id } })
  },
}
