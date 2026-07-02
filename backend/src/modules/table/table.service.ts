import { tableRepositoryAdmin } from './table.repository.js'
import type { TableCreate, TableUpdate } from './table.schema.js'
import { AppError } from '../../shared/AppError.js'

export const tableAdmin = {
  async getAll(keywordSearch?: string) {
    return tableRepositoryAdmin.findAll(keywordSearch)
  },

  async getTableZones() {
    const zones = await tableRepositoryAdmin.findZoneOptions()
    return { zones }
  },

  async create(input: TableCreate) {
    return tableRepositoryAdmin.create(input)
  },

  async update(id: string, input: TableUpdate) {
    const existing = await tableRepositoryAdmin.findById(id)

    if (!existing) {
      throw AppError.notFound('Table not found', 'TABLE_NOT_FOUND')
    }

    return tableRepositoryAdmin.update(id, input)
  },

  async remove(id: string) {
    const existing = await tableRepositoryAdmin.findById(id)

    if (!existing) {
      throw AppError.notFound('Table not found', 'TABLE_NOT_FOUND')
    }
    
    return tableRepositoryAdmin.remove(id)
  },
}
