import { dishRepository } from './dish.repository.js'

export const dishService = {
  getMenu() {
    return dishRepository.findAll()
  },
}