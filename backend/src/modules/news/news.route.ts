import type { FastifyInstance } from 'fastify'
import { newsService } from './news.service.js'
import { newsListQuerySchema, newsSlugParamSchema } from './news.schema.js'
import { langSchema } from '../../shared/schemas.js'

export async function newsRoutes(app: FastifyInstance) {
  app.get('/', async (request) => {
    const query = newsListQuerySchema.parse(request.query)
    return newsService.getList(query)
  })

  app.get('/:slug', async (request) => {
    const { slug } = newsSlugParamSchema.parse(request.params)
    const { lang } = langSchema.parse(request.query)
    return newsService.getBySlug(slug, lang)
  })
}