import type { FastifyInstance } from 'fastify'
import { dishService } from './dish.service.js'

export async function dishRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    return dishService.getMenu()
  })
}