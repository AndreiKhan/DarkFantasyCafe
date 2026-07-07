import { useDishes } from '@/entities/Dish'
import { useTranslation } from 'react-i18next'
import { Menu } from '@/widgets/Menu'

export function StepDishes({ dishQuantity, setQuantity, onBack, onNext }: {
  dishQuantity: Record<string, number>
  setQuantity: (dishId: string, quantity: number) => void
  onBack: () => void
  onNext: () => void
}) {
  const { t } = useTranslation('reservation')
  const { data: dishes } = useDishes({ tags: [], allergens: [] })

  const subtotal = (dishes ?? [])
  .reduce((sum, dish) => sum + dish.price * (dishQuantity[dish.id] ?? 0), 0)

  const chosen = (dishes ?? [])
    .map((dish) => ({ dish, quantity: dishQuantity[dish.id] ?? 0 }))
    .filter((q) => q.quantity > 0)

  return (
    <div className='reserve-dishes'>
      <h3 className='reserve-dishes__tip'>
        {t('dishes.tip')}
      </h3>
      <div className='reserve-dishes__info'>
        <div className='reserve-dishes__summary'>
          <p className='reserve-dishes__subtotal'>
            {t('dishes.subtotal', { price: subtotal })}
          </p>
          <ul className='reserve-dishes__dishes'>
            {chosen.map((x) => (
              <li className='reserve-dishes__dish' key={x.dish.id}>
                {x.dish.name} * {x.quantity} — {x.dish.price * x.quantity} ₽
              </li>
            ))}
          </ul>
        </div>
        <div className='reserve-dishes__nav'>
          <button className='reserve__button' type='button' onClick={onBack}>
            {t('actions.back')}
          </button>
          <button className='reserve__button' type='button' onClick={onNext}>
            {chosen?.length === 0 ? (
              t('actions.skip')
            ) : (
              t('actions.next')
            )}
          </button>
        </div>
      </div>

      <Menu dishQuantity={dishQuantity} onQuantityChange={setQuantity} hideTitle />
    </div>
  )
}
