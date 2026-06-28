import { prisma } from '../../db/prisma.js'
import type { NewsType } from '../../../generated/prisma/index.js'

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