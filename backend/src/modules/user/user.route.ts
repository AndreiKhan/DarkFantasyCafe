import type { FastifyInstance } from 'fastify'
import { userService, userAdmin } from './user.service.js'
import { userCreateSchema, userUpdateSchema, userSelfUpdateSchema, verifyPasswordSchema, changePasswordSchema } from './user.schema.js'
import { idParamSchema, searchQuerySchema } from '../../shared/schemas.js'
import { requireRole } from '../../plugins/auth.js'

export async function userRoutes(app: FastifyInstance) {
  app.get('/:id', { preHandler: app.authenticateOptional }, async (request) => {
    const { id } = idParamSchema.parse(request.params)
    return userService.getProfile(id, request.user?.sub ?? null)
  })

  app.patch('/', { preHandler: app.authenticate }, async (request) => {
    const data = userSelfUpdateSchema.parse(request.body)
    return userService.updateProfile(request.user!.sub, data)
  })

  app.post('/verify-password', { preHandler: app.authenticate }, async (request) => {
    const data = verifyPasswordSchema.parse(request.body)
    return userService.verifyPassword(request.user!.sub, data)
  })

  app.patch('/password', { preHandler: app.authenticate }, async (request) => {
    const data = changePasswordSchema.parse(request.body)
    return userService.changePassword(request.user!.sub, data)
  })
}

export async function userAdminRoutes(app: FastifyInstance) {
  const admin = { preHandler: [app.authenticate, requireRole('ADMIN')] }

  app.get('/all', admin, async (request) => {
    const { keywordSearch } = searchQuerySchema.parse(request.query)
    return userAdmin.getAll(keywordSearch)
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