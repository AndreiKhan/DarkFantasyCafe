import { prisma } from '../../db/prisma.js'
import type { DishQuery, DishCreate, DishUpdate } from './dish.schema.js'

export const dishRepository = {
  findAll(filter: DishQuery) {
    return prisma.dish.findMany({
      where: {
        deletedAt: null,
        ...(filter.keywordSearch
          ? {
              OR: [
                { nameRu: { contains: filter.keywordSearch, mode: 'insensitive' } },
                { nameEn: { contains: filter.keywordSearch, mode: 'insensitive' } },
              ],
            }
          : {}),
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

export const dishRepositoryAdmin = {
  findAll(keywordSearch?: string) {
    return prisma.dish.findMany({
      where: keywordSearch
        ? {
            OR: [
              { nameRu: { contains: keywordSearch, mode: 'insensitive' } },
              { nameEn: { contains: keywordSearch, mode: 'insensitive' } },
              { descriptionRu: { contains: keywordSearch, mode: 'insensitive' } },
              { descriptionEn: { contains: keywordSearch, mode: 'insensitive' } },
            ],
          }
        : {},
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        tags: true,
        allergens: true
      }
    })
  },

  findById(id: string) {
    return prisma.dish.findFirst({
      where: { id },
      include: {
        category: true,
        tags: true,
        allergens: true
      }
    })
  },

  findOptions() {
    return Promise.all([
      prisma.category.findMany(),
      prisma.tag.findMany(),
      prisma.allergen.findMany(),
    ])
  },

  create(input: DishCreate) {
    return prisma.dish.create({
      data: {
        nameRu: input.nameRu,
        nameEn: input.nameEn,
        descriptionRu: input.descriptionRu,
        descriptionEn: input.descriptionEn,
        price: input.price,
        images: input.images,
        category: { connect: { id: input.categoryId } },
        tags: { connect: input.tagIds.map((id) => ({ id })) },
        allergens: { connect: input.allergenIds.map((id) => ({ id })) },
      },
      include: { category: true, tags: true, allergens: true },
    })
  },

  update(id: string, input: DishUpdate) {
    return prisma.dish.update({
      where: { id },
      data: {
        deletedAt: null,
        nameRu: input.nameRu,
        nameEn: input.nameEn,
        descriptionRu: input.descriptionRu,
        descriptionEn: input.descriptionEn,
        price: input.price,
        images: input.images,
        ...(input.categoryId !== undefined ? { category: { connect: { id: input.categoryId } } } : {}),
        ...(input.tagIds !== undefined ? { tags: { set: input.tagIds.map((id) => ({ id })) } } : {}),
        ...(input.allergenIds !== undefined ? { allergens: { set: input.allergenIds.map((id) => ({ id })) } } : {}),
      },
      include: { category: true, tags: true, allergens: true },
    })
  },

  remove(id: string) {
    return prisma.dish.update({
      where: { id },
      data: { deletedAt: new Date() }
    })
  },
}