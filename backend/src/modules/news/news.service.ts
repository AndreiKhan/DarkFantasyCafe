import { newsRepository } from './news.repository.js'
import type { NewsListQuery } from './news.schema.js'
import type { News } from '../../../generated/prisma/index.js'
import { AppError } from '../../shared/AppError.js'

function toCard(n: News, lang: 'ru' | 'en') {
  return {
    slug: n.slug,
    type: n.type,
    title: lang === 'en' ? n.titleEn : n.titleRu,
    shortDescription: lang === 'en' ? n.shortDescriptionEn : n.shortDescriptionRu,
    image: n.images[0] ?? null,
    startsAt: n.startsAt,
    publishedAt: n.publishedAt,
  }
}

function toDetail(n: News, lang: 'ru' | 'en') {
  return {
    slug: n.slug,
    type: n.type,
    title: lang === 'en' ? n.titleEn : n.titleRu,
    shortDescription: lang === 'en' ? n.shortDescriptionEn : n.shortDescriptionRu,
    body: lang === 'en' ? n.bodyEn : n.bodyRu,
    images: n.images,
    startsAt: n.startsAt,
    endsAt: n.endsAt,
    publishedAt: n.publishedAt,
  }
}

export const newsService = {
  async getList(query: NewsListQuery) {
    const items = await newsRepository.findPublished(query.type)
    return items.map((n) => toCard(n, query.lang))
  },

  async getBySlug(slug: string, lang: 'ru' | 'en') {
    const news = await newsRepository.findPublishedBySlug(slug)
    if (!news) {
      throw AppError.notFound('News not found', 'NEWS_NOT_FOUND')
    }
    return toDetail(news, lang)
  },
}