import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

type AccessPayload = { sub: string; role: string }

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
    authenticateOptional: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
  interface FastifyRequest {
    user: AccessPayload | null
  }
}

export function registerAuthGuard(app: FastifyInstance) {
  app.decorateRequest('user', null)

  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    const header = request.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      return reply.code(401).send({ message: 'Unauthorized' })
    }

    try {
      request.user = jwt.verify(header.slice(7), env.JWT_ACCESS_SECRET) as AccessPayload
    } catch {
      return reply.code(401).send({ message: 'Unauthorized' })
    }
  })

  app.decorate('authenticateOptional', async (request: FastifyRequest, reply: FastifyReply) => {
    const header = request.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      request.user = null
      return
    }

    try {
      request.user = jwt.verify(header.slice(7), env.JWT_ACCESS_SECRET) as AccessPayload
    } catch {
      request.user = null
    }
  })
}

export function requireRole(...roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.code(401).send({ message: 'Unauthorized' })
    }
    if (!roles.includes(request.user.role)) {
      return reply.code(403).send({ message: 'Forbidden' })
    }
  }
}