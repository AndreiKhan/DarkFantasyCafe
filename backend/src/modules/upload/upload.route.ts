import type { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { AppError } from '../../shared/AppError.js'

export const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads')

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: app.authenticate }, async (request, reply) => {
    let file
    try {
      file = await request.file()
    } catch {
      throw AppError.badRequest('File is too large (max 5 MB)', 'FILE_TOO_LARGE')
    }

    if (!file) {
      throw AppError.badRequest('File is required', 'NO_FILE')
    }

    const extension = ALLOWED_MIME_TYPES[file.mimetype]
    if (!extension) {
      throw AppError.badRequest('Only JPG, PNG or WEBP images are allowed', 'UNSUPPORTED_TYPE')
    }

    const buffer = await file.toBuffer()

    await mkdir(UPLOAD_DIR, { recursive: true })

    const filename = `${randomUUID()}${extension}`
    await writeFile(path.join(UPLOAD_DIR, filename), buffer)

    const url = `${request.protocol}://${request.headers.host}/uploads/${filename}`

    return reply.code(201).send({ url })
  })
}
