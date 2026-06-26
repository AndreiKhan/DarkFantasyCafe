import type { FastifyInstance } from 'fastify'
import { reservationService } from './reservation.service.js'
import { createReservationSchema, tablesQuerySchema } from './reservation.schema.js'
import { langSchema, idParamSchema } from '../../shared/schemas.js'

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