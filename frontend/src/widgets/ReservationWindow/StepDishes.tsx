import { useDishes } from '@/entities/Dish'
import { Menu } from '@/widgets/Menu'

export function StepDishes({ dishQuantity, setQuantity, onBack, onNext }: {
  dishQuantity: Record<string, number>
  setQuantity: (dishId: string, quantity: number) => void
  onBack: () => void
  onNext: () => void
}) {
  const { data: dishes } = useDishes({ tags: [], allergens: [] })

  const subtotal = (dishes ?? [])
  .reduce((sum, dish) => sum + dish.price * (dishQuantity[dish.id] ?? 0), 0)

  return (
    <div className="reserve-dishes">
      <div className="reserve-dishes__footer">
        <span>
          Цена выбранных блюд: {subtotal} ₽
        </span>
        <div className="reserve-dishes__nav">
          <button type="button" onClick={onBack}>
            назад
          </button>
          <button type="button" onClick={onNext}>
            дальше
          </button>
        </div>
      </div>

      <Menu dishQuantity={dishQuantity} onQuantityChange={setQuantity} />
    </div>
  )
}
