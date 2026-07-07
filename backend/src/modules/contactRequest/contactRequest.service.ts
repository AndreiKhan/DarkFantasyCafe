import { contactRequestRepository, contactRequestRepositoryAdmin } from './contactRequest.repository.js'
import type { ContactRequestCreate } from './contactRequest.schema.js'
import { AppError } from '../../shared/AppError.js'

export const contactRequestService = {
  async create(input: ContactRequestCreate) {
    return contactRequestRepository.create(input)
  },
}

export const contactRequestAdmin = {
  async getAll(keywordSearch?: string) {
    return contactRequestRepositoryAdmin.findAll(keywordSearch)
  },

  async remove(id: string) {
    const existing = await contactRequestRepositoryAdmin.findById(id)
    if (!existing) {
      throw AppError.notFound('Contact request not found', 'CONTACT_REQUEST_NOT_FOUND')
    }
    return contactRequestRepositoryAdmin.remove(id)
  },
}
