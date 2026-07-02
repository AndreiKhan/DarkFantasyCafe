import type { FastifyInstance } from 'fastify'
import { tableAdmin } from './table.service.js'
import { tableCreateSchema, tableUpdateSchema } from './table.schema.js'
import { idParamSchema, searchQuerySchema } from '../../shared/schemas.js'
import { requireRole } from '../../plugins/auth.js'

export async function tableAdminRoutes(app: FastifyInstance) {
  const admin = { preHandler: [app.authenticate, requireRole('ADMIN')] }

  app.get('/all', admin, async (request) => {
    const { keywordSearch } = searchQuerySchema.parse(request.query)
    return tableAdmin.getAll(keywordSearch)
  })

  app.get('/zones', admin, async () => {
    return tableAdmin.getTableZones()
  })

  app.post('/', admin, async (request) => {
    const data = tableCreateSchema.parse(request.body)
    return tableAdmin.create(data)
  })

  app.patch('/:id', admin, async (request) => {
    const { id } = idParamSchema.parse(request.params)
    const data = tableUpdateSchema.parse(request.body)
    return tableAdmin.update(id, data)
  })

  app.delete('/:id', admin, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params)
    await tableAdmin.remove(id)
    return reply.code(204).send()
  })
}
