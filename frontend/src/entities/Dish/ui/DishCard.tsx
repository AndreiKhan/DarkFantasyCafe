import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import './DishCard.scss'
import { type Dish } from '@/entities/Dish'
import DishImages from './DishImages'

interface DishCardProps {
  dish: Dish
  quantity?: number
  onQuantityChange?: (dishId: string, quantity: number) => void
  onOpen?: (dish: Dish) => void
}

function DishCard({ dish, quantity = 0, onQuantityChange, onOpen }: DishCardProps) {
  const { t } = useTranslation('common')

  return (
    <article className='dish-card' aria-labelledby={`dish-${dish.id}-title`}>
      <div
        className={`dish-card__content${onOpen ? ' dish-card__content--clickable' : ''}`}
        onClick={onOpen ? () => onOpen(dish) : undefined}
        onKeyDown={onOpen ? (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onOpen(dish)
          }
        } : undefined}
        role={onOpen ? 'button' : undefined}
        tabIndex={onOpen ? 0 : undefined}
      >
        <div className='dish-card__present-block'>
          <DishImages images={dish.images} alt={dish.name} />
        </div>
        <div className='dish-card__info'>
          <h5 className='dish-card__title' id={`dish-${dish.id}-title`}>
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
        <div className='dish-card__quantity' role='group' aria-label={t('a11y.quantity', { count: quantity })}>
          <button
            className='dish-card__button'
            type='button'
            aria-label={t('a11y.decreaseQuantity')}
            onClick={(event) => {
              event.stopPropagation()
              onQuantityChange(dish.id, quantity - 1)
            }}
            disabled={quantity === 0}
          >
            <span aria-hidden='true'><b>−</b></span>
          </button>
          <span className='dish-card__number' aria-live='polite'>
            {quantity}
          </span>
          <button
            className='dish-card__button'
            type='button'
            aria-label={t('a11y.increaseQuantity')}
            onClick={(event) => {
              event.stopPropagation()
              onQuantityChange(dish.id, quantity + 1)
            }}
          >
            <span aria-hidden='true'><b>+</b></span>
          </button>
        </div>
      )}
    </article>
  )
}

export default memo(DishCard)
