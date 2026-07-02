import type { Dish, DishFilters } from '../model/types'
import { apiClient } from '@/shared/api'

export function getDishes(params: { lang: string } & DishFilters): Promise<Dish[]> {
  const search = new URLSearchParams()
  search.set('lang', params.lang)
  if (params.keywordSearch) {
    search.set('keywordSearch', params.keywordSearch)
  }
  if (params.category) {
    search.set('category', params.category)
  }
  if (params.tags.length) {
    search.set('tags', params.tags.join(','))
  }
  if (params.allergens.length) {
    search.set('allergens', params.allergens.join(','))
  }
  if (params.sort) {
    search.set('sort', params.sort)
  }

  return apiClient<Dish[]>(`/dish?${search.toString()}`)
}