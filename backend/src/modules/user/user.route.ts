import type { FastifyInstance } from 'fastify'
import { userService, userAdmin } from './user.service.js'
import { userCreateSchema, userUpdateSchema } from './user.schema.js'
import { idParamSchema } from '../../shared/schemas.js'
import { requireRole } from '../../plugins/auth.js'

export async function userRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: app.authenticate }, async (request) => {
    return userService.getProfile(request.user!.sub)
  })
}

export async function userAdminRoutes(app: FastifyInstance) {
  const admin = { preHandler: [app.authenticate, requireRole('ADMIN')] }

  app.get('/all', admin, async () => {
    return userAdmin.getAll()
  })

  app.post('/', admin, async (request) => {
    const data = userCreateSchema.parse(request.body)
    return userAdmin.create(data)
  })

  app.patch('/:id', admin, async (request) => {
    const { id } = idParamSchema.parse(request.params)
    const data = userUpdateSchema.parse(request.body)
    return userAdmin.update(id, data)
  })

  app.delete('/:id', admin, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params)
    await userAdmin.remove(id)
    return reply.code(204).send()
  })
}