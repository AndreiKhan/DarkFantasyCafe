import type { FastifyInstance } from 'fastify'
import { dishService, dishAdmin } from './dish.service.js'
import { dishQuerySchema, dishCreateSchema, dishUpdateSchema } from './dish.schema.js'
import { langSchema, idParamSchema } from '../../shared/schemas.js'
import { requireRole } from '../../plugins/auth.js'

export async function dishRoutes(app: FastifyInstance) {
  app.get('/', async (request) => {
    const query = dishQuerySchema.parse(request.query)
    return dishService.getMenu(query)
  })
  app.get('/filters', async (request) => {
    const { lang } = langSchema.parse(request.query)
    return dishService.getFilters(lang)
  })
}

export async function dishAdminRoutes(app: FastifyInstance) {
  const admin = { preHandler: [app.authenticate, requireRole('ADMIN')] }

  app.get('/all', admin, async () => {
    return dishAdmin.getAll()
  })

  app.get('/options', admin, async () => {
    return dishAdmin.getOptions()
  })

  app.post('/', admin, async (request) => {
    const data = dishCreateSchema.parse(request.body)
    return dishAdmin.create(data)
  })

  app.patch('/:id', admin, async (request) => {
    const { id } = idParamSchema.parse(request.params)
    const data = dishUpdateSchema.parse(request.body)
    return dishAdmin.update(id, data)
  })

  app.delete('/:id', admin, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params)
    await dishAdmin.remove(id)
    return reply.code(204).send()
  })
}