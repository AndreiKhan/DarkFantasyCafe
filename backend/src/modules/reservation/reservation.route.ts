import type { FastifyInstance } from 'fastify'
import { reservationService, reservationAdmin } from './reservation.service.js'
import { createReservationSchema, tablesQuerySchema, reservationCreateSchema, reservationUpdateSchema } from './reservation.schema.js'
import { langSchema, idParamSchema } from '../../shared/schemas.js'
import { requireRole } from '../../plugins/auth.js'

export async function reservationRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: app.authenticate }, async (request) => {
    const body = createReservationSchema.parse(request.body)
    return reservationService.createDraft(request.user!.sub, body)
  })

  app.get('/tables', async (request) => {
    const query = tablesQuerySchema.parse(request.query)
    return reservationService.getTables(query)
  })

  app.get('/:id', { preHandler: app.authenticate }, async (request) => {
    const { id } = idParamSchema.parse(request.params)
    const { lang } = langSchema.parse(request.query)
    return reservationService.getById(request.user!.sub, id, lang)
  })

  app.post('/:id/pay', { preHandler: app.authenticate }, async (request) => {
    const { id } = idParamSchema.parse(request.params)
    return reservationService.pay(request.user!.sub, id)
  })

  app.get('/:id/status', { preHandler: app.authenticate }, async (request) => {
    const { id } = idParamSchema.parse(request.params)
    const { lang } = langSchema.parse(request.query)
    return reservationService.getStatus(request.user!.sub, id, lang)
  })
}

export async function reservationAdminRoutes(app: FastifyInstance) {
  const admin = { preHandler: [app.authenticate, requireRole('ADMIN')] }

  app.get('/all', admin, async () => {
    return reservationAdmin.getAll()
  })

  app.get('/options', admin, async () => {
    return reservationAdmin.getOptions()
  })

  app.post('/', admin, async (request) => {
    const data = reservationCreateSchema.parse(request.body)
    return reservationAdmin.create(data)
  })

  app.patch('/:id', admin, async (request) => {
    const { id } = idParamSchema.parse(request.params)
    const data = reservationUpdateSchema.parse(request.body)
    return reservationAdmin.update(id, data)
  })

  app.delete('/:id', admin, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params)
    await reservationAdmin.remove(id)
    return reply.code(204).send()
  })
}