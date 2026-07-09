import type { FastifyInstance } from 'fastify'
import { achievementService } from './achievement.service.js'
import { achievementEventSchema } from './achievement.schema.js'
import { langSchema } from '../../shared/schemas.js'

export async function achievementRoutes(app: FastifyInstance) {
  app.post('/events', { preHandler: app.authenticate }, async (request) => {
    const { code } = achievementEventSchema.parse(request.body)
    const { lang } = langSchema.parse(request.query)
    const achievement = await achievementService.unlock(request.user!.sub, code)

    if (!achievement) {
      return { unlocked: false, achievement: null }
    }

    return {
      unlocked: true,
      achievement: {
        id: achievement.id,
        code: achievement.code,
        name: lang === 'en' ? achievement.nameEn : achievement.nameRu,
        howToGet: lang === 'en' ? achievement.howToGetEn : achievement.howToGetRu,
        bonuses: achievement.bonuses,
        rarity: achievement.rarity,
      },
    }
  })
}
