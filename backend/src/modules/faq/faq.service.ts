import { faqRepository, faqRepositoryAdmin } from './faq.repository.js'
import type { FaqCreate, FaqUpdate } from './faq.schema.js'
import type { Faq } from '../../../generated/prisma/index.js'
import { AppError } from '../../shared/AppError.js'

function toCard(faq: Faq, lang: 'ru' | 'en') {
  return {
    id: faq.id,
    title: lang === 'en' ? faq.titleEn : faq.titleRu,
    description: lang === 'en' ? faq.descriptionEn : faq.descriptionRu,
  }
}

export const faqService = {
  async getList(lang: 'ru' | 'en') {
    const items = await faqRepository.findAll()
    return items.map((item) => toCard(item, lang))
  },
}

export const faqAdmin = {
  async getAll(keywordSearch?: string) {
    return faqRepositoryAdmin.findAll(keywordSearch)
  },

  async create(input: FaqCreate) {
    return faqRepositoryAdmin.create(input)
  },

  async update(id: string, input: FaqUpdate) {
    const existing = await faqRepositoryAdmin.findById(id)
    if (!existing) {
      throw AppError.notFound('Faq not found', 'FAQ_NOT_FOUND')
    }
    return faqRepositoryAdmin.update(id, input)
  },

  async remove(id: string) {
    const existing = await faqRepositoryAdmin.findById(id)
    if (!existing) {
      throw AppError.notFound('Faq not found', 'FAQ_NOT_FOUND')
    }
    return faqRepositoryAdmin.remove(id)
  },
}
