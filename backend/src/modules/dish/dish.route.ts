import type { FastifyInstance } from 'fastify'
import { dishService, dishAdmin } from './dish.service.js'
import { dishQuerySchema, dishCreateSchema, dishUpdateSchema } from './dish.schema.js'
import { langSchema, idParamSchema, searchQuerySchema } from '../../shared/schemas.js'
import { requireRole } from '../../plugins/auth.js'

export async function dishRoutes(app: FastifyInstance) {
  app.get('/', {
    schema: {
      tags: ['dish'],
      summary: 'Список блюд меню',
      querystring: {
        type: 'object',
        properties: {
          lang: { type: 'string', enum: ['ru', 'en'] },
          category: { type: 'string' },
          tags: { type: 'string', description: 'ID тегов через запятую' },
          allergens: { type: 'string', description: 'ID аллергенов через запятую' },
          sort: { type: 'string', enum: ['price_asc', 'price_desc'] },
          keywordSearch: { type: 'string' },
        },
      },
    },
  }, async (request) => {
    const query = dishQuerySchema.parse(request.query)
    return dishService.getMenu(query)
  })
  app.get('/filters', {
    schema: {
      tags: ['dish'],
      summary: 'Категории, теги и аллергены для фильтров меню',
      querystring: {
        type: 'object',
        properties: { lang: { type: 'string', enum: ['ru', 'en'] } },
      },
    },
  }, async (request) => {
    const { lang } = langSchema.parse(request.query)
    return dishService.getFilters(lang)
  })
}

export async function dishAdminRoutes(app: FastifyInstance) {
  const admin = { preHandler: [app.authenticate, requireRole('ADMIN')] }

  app.get('/all', admin, async (request) => {
    const { keywordSearch } = searchQuerySchema.parse(request.query)
    return dishAdmin.getAll(keywordSearch)
  })

  app.get('/options', admin, async () => {
    return dishAdmin.getOptions()
  })

  app.post('/', admin, async (request) => {
    const data = dishCreateSchema.parse(request.body)
    return dishAdmin.create(data)
  })

  app.patch('/:id', admin, async (request) => {
    const { id } = idParamSchema.parse(request.params)
    const data = dishUpdateSchema.parse(request.body)
    return dishAdmin.update(id, data)
  })

  app.delete('/:id', admin, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params)
    await dishAdmin.remove(id)
    return reply.code(204).send()
  })
}