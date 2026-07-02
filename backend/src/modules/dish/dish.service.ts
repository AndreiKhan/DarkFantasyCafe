import { dishRepository, dishRepositoryAdmin } from './dish.repository.js'
import type { DishQuery, DishCreate, DishUpdate } from './dish.schema.js'
import { AppError } from '../../shared/AppError.js'

export const dishService = {
  async getMenu(query: DishQuery) {
    const dishes = await dishRepository.findAll(query)

    return dishes.map((dish) => ({
      id: dish.id,
      name: query.lang === 'en' ? dish.nameEn : dish.nameRu,
      description: query.lang === 'en' ? dish.descriptionEn : dish.descriptionRu,
      price: dish.price,
      images: dish.images,
      category: {
        slug: dish.category.slug,
        name: query.lang === 'en' ? dish.category.nameEn : dish.category.nameRu,
      },
      tags: dish.tags.map((tag) => ({
        slug: tag.slug,
        name: query.lang === 'en' ? tag.nameEn : tag.nameRu,
      })),
      allergens: dish.allergens.map((allergen) => ({
        slug: allergen.slug,
        name: query.lang === 'en' ? allergen.nameEn : allergen.nameRu,
      })),
    }))
  },

  async getFilters(lang: 'ru' | 'en') {
    const [categories, tags, allergens] = await dishRepository.findFilterOptions()
    const filterOptions = (items: {
      slug: string,
      nameRu: string,
      nameEn: string,
    }[]) => items.map((item) => ({
      slug: item.slug,
      name: lang === 'en' ? item.nameEn : item.nameRu
    }))

    return {
      categories: filterOptions(categories),
      tags: filterOptions(tags),
      allergens: filterOptions(allergens),
    }
  },
}

export const dishAdmin = {
  async getAll(keywordSearch?: string) {
    return dishRepositoryAdmin.findAll(keywordSearch)
  },

  async getOptions() {
    const [categories, tags, allergens] = await dishRepositoryAdmin.findOptions()
    return { categories, tags, allergens }
  },

  async create(input: DishCreate) {
    return dishRepositoryAdmin.create(input)
  },

  async update(id: string, input: DishUpdate) {
    const existing = await dishRepositoryAdmin.findById(id)
    if (!existing) {
      throw AppError.notFound('Dish not found', 'DISH_NOT_FOUND')
    }
    return dishRepositoryAdmin.update(id, input)
  },

  async remove(id: string) {
    const existing = await dishRepositoryAdmin.findById(id)
    if (!existing) {
      throw AppError.notFound('Dish not found', 'DISH_NOT_FOUND')
    }
    return dishRepositoryAdmin.remove(id)
  },
}