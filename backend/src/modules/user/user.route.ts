import type { FastifyInstance } from 'fastify'
import { userService } from './user.service.js'

export async function userRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: app.authenticate }, async (request) => {
    return userService.getProfile(request.user!.sub)
  })
}