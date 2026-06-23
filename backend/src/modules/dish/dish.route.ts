import type { FastifyInstance } from 'fastify'
import { dishService } from './dish.service.js'
import { dishQuerySchema, langSchema } from './dish.schema.js'

export async function dishRoutes(app: FastifyInstance) {
  app.get('/', async (request) => {
    const query = dishQuerySchema.parse(request.query)
    return dishService.getMenu(query)
  })
  app.get('/filters', async (request) => {
    const { lang } = langSchema.parse(request.query)
    return dishService.getFilters(lang)
  })
}