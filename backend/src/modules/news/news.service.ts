import { newsRepository, newsRepositoryAdmin } from './news.repository.js'
import type { NewsListQuery, NewsCreate, NewsUpdate } from './news.schema.js'
import type { News } from '../../../generated/prisma/client.js'
import { AppError } from '../../shared/AppError.js'

function toCard(n: News, lang: 'ru' | 'en') {
  return {
    slug: n.slug,
    type: n.type,
    title: lang === 'en' ? n.titleEn : n.titleRu,
    shortDescription: lang === 'en' ? n.shortDescriptionEn : n.shortDescriptionRu,
    image: n.images[0] ?? null,
    startsAt: n.startsAt,
    endsAt: n.endsAt,
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

async function assertSlugAvailable(slug: string, excludeId?: string) {
  const existing = await newsRepositoryAdmin.findBySlug(slug)

  if (existing && existing.id !== excludeId) {
    throw AppError.conflict('Slug already in use', 'SLUG_TAKEN')
  }
}

export const newsAdmin = {
  async getAll(keywordSearch?: string) {
    return await newsRepositoryAdmin.findAll(keywordSearch)
  },

  async create(input: NewsCreate) {
    await assertSlugAvailable(input.slug)
    const publishedAt = input.status === 'PUBLISHED' ? new Date() : null
    return newsRepositoryAdmin.create({ ...input, publishedAt })
  },

  async update(id: string, input: NewsUpdate) {
    const existing = await newsRepositoryAdmin.findById(id)
    if (!existing) {
      throw AppError.notFound('News not found', 'NEWS_NOT_FOUND')
    }
    if (input.slug) {
      await assertSlugAvailable(input.slug, id)
    }
    const publishedAt = input.status === 'PUBLISHED' && !existing.publishedAt ? new Date() : undefined
    return newsRepositoryAdmin.update(id, { ...input, publishedAt })
  },

  async remove(id: string) {
    const existing = await newsRepositoryAdmin.findById(id)
    if (!existing) {
      throw AppError.notFound('News not found', 'NEWS_NOT_FOUND')
    }
    return newsRepositoryAdmin.remove(id)
  },
}
