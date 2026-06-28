import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import { ZodError } from 'zod'
import { AppError } from './shared/AppError.js'
import { dishRoutes } from './modules/dish/dish.route.js'
import { authRoutes } from './modules/auth/auth.route.js'
import { newsRoutes } from './modules/news/news.route.js'
import { userRoutes } from './modules/user/user.route.js'
import { registerAuthGuard } from './plugins/auth.js'
import { reservationRoutes } from './modules/reservation/reservation.route.js'
import { reservationService } from './modules/reservation/reservation.service.js'


export function buildApp() {
  const app = Fastify({ logger: true })

  app.register(cors, { origin: 'http://localhost:5173', credentials: true })
  app.register(cookie)

  registerAuthGuard(app)

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({ message: 'Validation error', issues: error.issues })
    }
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message, code: error.code })
    }
    app.log.error(error)
    return reply.code(500).send({ message: 'Internal server error' })
  })

  app.register(dishRoutes, { prefix: '/dish' })
  app.register(authRoutes, { prefix: '/auth' })
  app.register(reservationRoutes, { prefix: '/reservation' })
  app.register(newsRoutes, { prefix: '/news' })
  app.register(userRoutes, { prefix: '/user' })

  app.post('/payments/yookassa/webhook', async (request, reply) => {
    const body = request.body as { object?: { metadata?: { reservationId?: string } } }

    const reservationId = body?.object?.metadata?.reservationId

    if (reservationId) {
      await reservationService.handleWebhook(reservationId).catch((e) => app.log.error(e))
    }

    return reply.code(200).send({ ok: true })
  })

  return app
}