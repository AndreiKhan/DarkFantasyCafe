import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import { ZodError } from 'zod'
import { dishRoutes } from './modules/dish/dish.route.js'
import { authRoutes } from './modules/auth/auth.route.js'
import { registerAuthGuard } from './plugins/auth.js'

export function buildApp() {
  const app = Fastify({ logger: true })

  app.register(cors, { origin: 'http://localhost:5173', credentials: true })
  app.register(cookie)

  registerAuthGuard(app)

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({ message: 'Validation error', issues: error.issues })
    }
    if (error instanceof Error) {
      if (error.message === 'EMAIL_TAKEN') {
        return reply.code(409).send({ message: 'Email already registered' })
      }
      if (error.message === 'INVALID_CREDENTIALS') {
        return reply.code(401).send({ message: 'Invalid email or password' })
      }
      if (error.message === 'INVALID_REFRESH') {
        return reply.code(401).send({ message: 'Refresh token revoked' })
      }
    }
    app.log.error(error)
    return reply.code(500).send({ message: 'Internal server error' })
  })

  app.register(dishRoutes, { prefix: '/dish' })
  app.register(authRoutes, { prefix: '/auth' })

  return app
}