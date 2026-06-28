import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import { ZodError } from 'zod'
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
      if (error.message === 'RESERVATION_IN_PAST') {
        return reply.code(400).send({ message: 'Reservation time is in the past' })
      }
      if (error.message === 'TABLE_NOT_FOUND') {
        return reply.code(404).send({ message: 'Table not found' })
      }
      if (error.message === 'TABLE_TOO_SMALL') {
        return reply.code(400).send({ message: 'Table capacity is too small for the party' })
      }
      if (error.message === 'TABLE_UNAVAILABLE') {
        return reply.code(409).send({ message: 'Table is already booked for this time' })
      }
      if (error.message === 'DISH_NOT_FOUND') {
        return reply.code(400).send({ message: 'One or more dishes not found' })
      }
      if (error.message === 'RESERVATION_NOT_FOUND') {
        return reply.code(404).send({ message: 'Reservation not found' })
      }
      if (error.message === 'FORBIDDEN') {
        return reply.code(403).send({ message: 'Forbidden' })
      }
      if (error.message === 'PAYMENTS_NOT_CONFIGURED') {
        return reply.code(503).send({ message: 'Payments are not configured' })
      }
      if (error.message === 'YOOKASSA_ERROR') {
        return reply.code(502).send({ message: 'Payment provider error' })
      }
      if (error.message === 'ALREADY_PAID') {
        return reply.code(409).send({ message: 'Reservation already paid' })
      }
      if (error.message === 'RESERVATION_CANCELLED') {
        return reply.code(409).send({ message: 'Reservation is cancelled' })
      }
      if (error.message === 'NEWS_NOT_FOUND') {
        return reply.code(404).send({ message: 'News not found' })
      }
      if (error.message === 'USER_NOT_FOUND') {
        return reply.code(404).send({ message: 'User not found' })
      }
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