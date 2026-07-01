import { prisma } from '../../db/prisma.js'
import type { TableCreate, TableUpdate } from './table.schema.js'

export const tableRepositoryAdmin = {
  findAll() {
    return prisma.table.findMany({ orderBy: { number: 'asc' }, include: { zone: true } })
  },

  findById(id: string) {
    return prisma.table.findUnique({ where: { id }, include: { zone: true } })
  },

  findZoneOptions() {
    return prisma.zone.findMany({ orderBy: { nameRu: 'asc' } })
  },

  create(input: TableCreate) {
    return prisma.table.create({
      data: {
        number: input.number,
        capacity: input.capacity,
        x: input.x,
        y: input.y,
        isActive: input.isActive,
        zone: { connect: { id: input.zoneId } },
      },
      include: { zone: true },
    })
  },

  update(id: string, input: TableUpdate) {
    return prisma.table.update({
      where: { id },
      data: {
        number: input.number,
        capacity: input.capacity,
        x: input.x,
        y: input.y,
        isActive: input.isActive,
        ...(input.zoneId !== undefined ? { zone: { connect: { id: input.zoneId } } } : {}),
      },
      include: { zone: true },
    })
  },

  remove(id: string) {
    return prisma.table.delete({ where: { id } })
  },
}
