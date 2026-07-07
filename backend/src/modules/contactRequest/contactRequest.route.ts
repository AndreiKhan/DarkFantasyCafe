import type { FastifyInstance } from 'fastify'
import { contactRequestService, contactRequestAdmin } from './contactRequest.service.js'
import { contactRequestCreateSchema } from './contactRequest.schema.js'
import { idParamSchema, searchQuerySchema } from '../../shared/schemas.js'
import { requireRole } from '../../plugins/auth.js'

export async function contactRequestRoutes(app: FastifyInstance) {
  app.post('/', async (request) => {
    const data = contactRequestCreateSchema.parse(request.body)
    return contactRequestService.create(data)
  })
}

export async function contactRequestAdminRoutes(app: FastifyInstance) {
  const admin = { preHandler: [app.authenticate, requireRole('ADMIN')] }

  app.get('/all', admin, async (request) => {
    const { keywordSearch } = searchQuerySchema.parse(request.query)
    return contactRequestAdmin.getAll(keywordSearch)
  })

  app.delete('/:id', admin, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params)
    await contactRequestAdmin.remove(id)
    return reply.code(204).send()
  })
}
