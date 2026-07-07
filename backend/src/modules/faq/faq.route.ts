import type { FastifyInstance } from 'fastify'
import { faqService, faqAdmin } from './faq.service.js'
import { faqCreateSchema, faqUpdateSchema } from './faq.schema.js'
import { langSchema, idParamSchema, searchQuerySchema } from '../../shared/schemas.js'
import { requireRole } from '../../plugins/auth.js'

export async function faqRoutes(app: FastifyInstance) {
  app.get('/', async (request) => {
    const { lang } = langSchema.parse(request.query)
    return faqService.getList(lang)
  })
}

export async function faqAdminRoutes(app: FastifyInstance) {
  const admin = { preHandler: [app.authenticate, requireRole('ADMIN')] }

  app.get('/all', admin, async (request) => {
    const { keywordSearch } = searchQuerySchema.parse(request.query)
    return faqAdmin.getAll(keywordSearch)
  })

  app.post('/', admin, async (request) => {
    const data = faqCreateSchema.parse(request.body)
    return faqAdmin.create(data)
  })

  app.patch('/:id', admin, async (request) => {
    const { id } = idParamSchema.parse(request.params)
    const data = faqUpdateSchema.parse(request.body)
    return faqAdmin.update(id, data)
  })

  app.delete('/:id', admin, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params)
    await faqAdmin.remove(id)
    return reply.code(204).send()
  })
}
