import type { FastifyInstance } from 'fastify'
import { env } from '../../config/env.js'
import { registerSchema, loginSchema } from './auth.schema.js'
import { authService } from './auth.service.js'

const REFRESH_COOKIE = 'refreshToken'

const cookieOptions = {
  httpOnly: true,
  secure: env.FRONTEND_URL.startsWith('https://'),
  sameSite: 'lax' as const,
  path: '/api/auth',
  maxAge: 60 * 60 * 24 * 7,
}

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', {
    schema: {
      tags: ['auth'],
      summary: 'Регистрация нового пользователя',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
          firstName: { type: 'string' },
          secondName: { type: 'string' },
          phone: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    const body = registerSchema.parse(request.body)
    const { accessToken, refreshToken } = await authService.register(body)
    reply.setCookie(REFRESH_COOKIE, refreshToken, cookieOptions)
    return { accessToken }
  })

  app.post('/login', {
    schema: {
      tags: ['auth'],
      summary: 'Вход по email и паролю',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    const body = loginSchema.parse(request.body)
    const { accessToken, refreshToken } = await authService.login(body)
    reply.setCookie(REFRESH_COOKIE, refreshToken, cookieOptions)
    return { accessToken }
  })

  app.post('/refresh', {
    schema: {
      tags: ['auth'],
      summary: 'Обновление access token по refresh cookie',
    },
  }, async (request, reply) => {
    const token = request.cookies[REFRESH_COOKIE]
    if (!token) {
      return reply.code(401).send({ message: 'No refresh token' })
    }

    try {
      const { accessToken, refreshToken } = await authService.refresh(token)
      reply.setCookie(REFRESH_COOKIE, refreshToken, cookieOptions)
      return { accessToken }
    } catch {
      reply.clearCookie(REFRESH_COOKIE, { path: '/api/auth' })
      return reply.code(401).send({ message: 'Invalid refresh token' })
    }
  })

  app.post('/logout', {
    schema: {
      tags: ['auth'],
      summary: 'Выход, отзыв refresh token',
    },
  }, async (request, reply) => {
    await authService.logout(request.cookies[REFRESH_COOKIE])
    reply.clearCookie(REFRESH_COOKIE, { path: '/api/auth' })
    return { ok: true }
  })

  app.get('/me', {
    preHandler: app.authenticate,
    schema: {
      tags: ['auth'],
      summary: 'Текущий авторизованный пользователь',
      security: [{ bearerAuth: [] }],
    },
  }, async (request) => {
    return { user: request.user }
  })
}