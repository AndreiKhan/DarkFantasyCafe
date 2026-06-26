import { memo } from 'react'
import './DishCard.scss'
import { type Dish } from '@/entities/Dish'

interface DishCardProps {
  dish: Dish
  quantity?: number
  onQuantityChange?: (dishId: string, quantity: number) => void
}

function DishCard({ dish, quantity = 0, onQuantityChange }: DishCardProps) {
  return (
    <div className='dish-card'>
      <div className='dish-card__content'>
        <div className='dish-card__present-block'>
          <img className='dish-card__image' src={dish.images[0]} alt={dish.name} />
        </div>
        <div className='dish-card__info'>
          <h5 className='dish-card__title'>
            {dish.name}
          </h5>
          <p className='dish-card__description'>
            {dish.description}
          </p>
          <p className='dish-card__price'>
            {dish.price} ₽
          </p>
        </div>
      </div>
      {onQuantityChange && (
        <div className='dish-card__quantity'>
          <button type='button' onClick={() => onQuantityChange(dish.id, quantity - 1)} disabled={quantity === 0}>
            −
          </button>
          <span>
            {quantity}
          </span>
          <button type='button' onClick={() => onQuantityChange(dish.id, quantity + 1)}>
            +
          </button>
        </div>
      )}
    </div>
  )
}

export default memo(DishCard)
