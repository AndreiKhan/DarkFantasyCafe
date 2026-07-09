import type { FastifyInstance } from 'fastify'
import { requireRole } from '../../plugins/auth.js'
import { statsQuerySchema } from './stats.schema.js'
import { buildStats } from './stats.service.js'

export async function statsAdminRoutes(app: FastifyInstance) {
  const admin = { preHandler: [app.authenticate, requireRole('ADMIN')] }

  app.get('/', admin, async (request) => {
    const query = statsQuerySchema.parse(request.query)
    return buildStats(query)
  })
}
