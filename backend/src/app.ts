import Fastify from 'fastify'
import cors from '@fastify/cors'
import cookie from '@fastify/cookie'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import { mkdirSync } from 'node:fs'
import { ZodError } from 'zod'
import { AppError } from './shared/AppError.js'
import { dishRoutes, dishAdminRoutes } from './modules/dish/dish.route.js'
import { authRoutes } from './modules/auth/auth.route.js'
import { newsRoutes, newsAdminRoutes } from './modules/news/news.route.js'
import { faqRoutes, faqAdminRoutes } from './modules/faq/faq.route.js'
import { contactRequestRoutes, contactRequestAdminRoutes } from './modules/contactRequest/contactRequest.route.js'
import { userRoutes, userAdminRoutes } from './modules/user/user.route.js'
import { registerAuthGuard } from './plugins/auth.js'
import { reservationRoutes, reservationAdminRoutes } from './modules/reservation/reservation.route.js'
import { reservationService } from './modules/reservation/reservation.service.js'
import { tableAdminRoutes } from './modules/table/table.route.js'
import { uploadRoutes, UPLOAD_DIR } from './modules/upload/upload.route.js'
import { characterRoutes, characterAdminRoutes } from './modules/character/character.route.js'
import { achievementRoutes } from './modules/achievement/achievement.route.js'
import { statsAdminRoutes } from './modules/stats/stats.route.js'


export function buildApp(options?: { logger?: boolean }) {
  const app = Fastify({ logger: options?.logger ?? true })

  app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
  app.register(cookie)
  
  app.register(multipart, { limits: { fileSize: 5 * 1024 * 1024 } })

  mkdirSync(UPLOAD_DIR, { recursive: true })
  app.register(fastifyStatic, { root: UPLOAD_DIR, prefix: '/uploads/' })

  registerAuthGuard(app)

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({ message: 'Validation error', issues: error.issues })
    }
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ message: error.message, code: error.code })
    }

    const prismaCode = (error as { code?: string }).code
    if (prismaCode === 'P2002') {
      return reply.code(409).send({ message: 'Resource already exists', code: 'ALREADY_EXISTS' })
    }
    if (prismaCode === 'P2025') {
      return reply.code(404).send({ message: 'Resource not found', code: 'NOT_FOUND' })
    }
    if (prismaCode === 'P2003') {
      return reply.code(409).send({ message: 'Resource is referenced by other records', code: 'REFERENCED' })
    }

    app.log.error(error)
    return reply.code(500).send({ message: 'Internal server error' })
  })

  app.register(dishRoutes, { prefix: '/dish' })
  app.register(authRoutes, { prefix: '/auth' })
  app.register(reservationRoutes, { prefix: '/reservation' })
  app.register(newsRoutes, { prefix: '/news' })
  app.register(faqRoutes, { prefix: '/faq' })
  app.register(contactRequestRoutes, { prefix: '/contact-request' })
  app.register(userRoutes, { prefix: '/user' })
  app.register(uploadRoutes, { prefix: '/upload' })
  app.register(characterRoutes, { prefix: '/character' })
  app.register(achievementRoutes, { prefix: '/achievement' })

  app.register(newsAdminRoutes, { prefix: '/admin/news' })
  app.register(dishAdminRoutes, { prefix: '/admin/dish' })
  app.register(reservationAdminRoutes, { prefix: '/admin/reservation' })
  app.register(faqAdminRoutes, { prefix: '/admin/faq' })
  app.register(contactRequestAdminRoutes, { prefix: '/admin/contact-request' })
  app.register(userAdminRoutes, { prefix: '/admin/user' })
  app.register(tableAdminRoutes, { prefix: '/admin/table' })
  app.register(characterAdminRoutes, { prefix: '/admin/character' })
  app.register(statsAdminRoutes, { prefix: '/admin/stats' })

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