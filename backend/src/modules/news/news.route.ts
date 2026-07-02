import type { FastifyInstance } from 'fastify'
import { newsService, newsAdmin } from './news.service.js'
import { newsListQuerySchema, newsSlugParamSchema, newsCreateSchema, newsUpdateSchema } from './news.schema.js'
import { langSchema, idParamSchema, searchQuerySchema } from '../../shared/schemas.js'
import { requireRole } from '../../plugins/auth.js'

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

export async function newsAdminRoutes(app: FastifyInstance) {
  const admin = { preHandler: [app.authenticate, requireRole('ADMIN')] }

  app.get('/all', admin, async (request) => {
    const { keywordSearch } = searchQuerySchema.parse(request.query)
    return newsAdmin.getAll(keywordSearch)
  })

  app.post('/', admin, async (request) => {
    const data = newsCreateSchema.parse(request.body)
    return newsAdmin.create(data)
  })

  app.patch('/:id', admin, async (request) => {
    const { id } = idParamSchema.parse(request.params)
    const data = newsUpdateSchema.parse(request.body)
    return newsAdmin.update(id, data)
  })

  app.delete('/:id', admin, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params)
    await newsAdmin.remove(id)
    return reply.code(204).send()
  })
}
