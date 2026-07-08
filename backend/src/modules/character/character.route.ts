import type { FastifyInstance } from 'fastify'
import { characterService, characterAdmin } from './character.service.js'
import {
  characterCreateSchema,
  characterUpdateSchema,
  characterAdminCreateSchema,
  characterAdminUpdateSchema,
} from './character.schema.js'
import { idParamSchema, searchQuerySchema } from '../../shared/schemas.js'
import { requireRole } from '../../plugins/auth.js'

export async function characterRoutes(app: FastifyInstance) {
  app.get('/reference-data', async () => {
    return characterService.getReferenceData()
  })

  app.get('/', async () => {
    return characterService.listAll()
  })

  app.get('/mine', { preHandler: app.authenticate }, async (request) => {
    return characterService.listMine(request.user!.sub)
  })

  app.get('/:id', async (request) => {
    const { id } = idParamSchema.parse(request.params)
    return characterService.getById(id)
  })

  app.post('/', { preHandler: app.authenticate }, async (request, reply) => {
    const data = characterCreateSchema.parse(request.body)
    const character = await characterService.create(request.user!.sub, data)
    return reply.code(201).send(character)
  })

  app.patch('/:id', { preHandler: app.authenticate }, async (request) => {
    const { id } = idParamSchema.parse(request.params)
    const data = characterUpdateSchema.parse(request.body)
    return characterService.update(id, request.user!.sub, data)
  })

  app.delete('/:id', { preHandler: app.authenticate }, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params)
    await characterService.remove(id, request.user!.sub)
    return reply.code(204).send()
  })
}

export async function characterAdminRoutes(app: FastifyInstance) {
  const admin = { preHandler: [app.authenticate, requireRole('ADMIN')] }

  app.get('/all', admin, async (request) => {
    const { keywordSearch } = searchQuerySchema.parse(request.query)
    return characterAdmin.getAll(keywordSearch)
  })

  app.post('/', admin, async (request, reply) => {
    const data = characterAdminCreateSchema.parse(request.body)
    const character = await characterAdmin.create(data)
    return reply.code(201).send(character)
  })

  app.patch('/:id', admin, async (request) => {
    const { id } = idParamSchema.parse(request.params)
    const data = characterAdminUpdateSchema.parse(request.body)
    return characterAdmin.update(id, data)
  })

  app.delete('/:id', admin, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params)
    await characterAdmin.remove(id)
    return reply.code(204).send()
  })
}
