import { prisma } from '../../db/prisma.js'
import type { DishQuery } from './dish.schema.js'

export const dishRepository = {
  findAll(filter: DishQuery) {
    return prisma.dish.findMany({
      where: {
        deletedAt: null,
        ...(filter.category
          ? { category: { slug: filter.category } }
          : {}),
        ...(filter.tags.length
          ? { AND: filter.tags.map((slug) => ({ tags: { some: { slug } } })) }
          : {}),
        ...(filter.allergens.length
          ? { allergens: { none: { slug: { in: filter.allergens } } } }
          : {}),
      },
      orderBy:
        filter.sort === 'price_desc'
          ? { price: 'desc' }
          : filter.sort === 'price_asc'
            ? { price: 'asc' }
            : { createdAt: 'asc' },
      include: { category: true, tags: true, allergens: true },
    })
  },

  findFilterOptions() {
    return Promise.all([
      prisma.category.findMany(),
      prisma.tag.findMany(),
      prisma.allergen.findMany(),
    ])
  }
}