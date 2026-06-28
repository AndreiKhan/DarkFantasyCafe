import { Link } from 'react-router-dom'
import type { AvailabilityParams, AvailabilityTable, AvailabilityZone, ReservationSummary } from '@/entities/Reservation'
import { useCreateReservation } from '@/entities/Reservation'
import { useDishes } from '@/entities/Dish'
import { useMe } from '@/entities/Auth'

export function StepConfirm({ params, table, zone, dishQuantity, onBack, onCreated }: {
  params: AvailabilityParams
  table: AvailabilityTable
  zone: AvailabilityZone
  dishQuantity: Record<string, number>
  onBack: () => void
  onCreated: (reserve: ReservationSummary) => void
}) {
  const { data: me } = useMe()
  const isAuthed = !!me?.user
  const { data: dishes } = useDishes({ tags: [], allergens: [] })
  const create = useCreateReservation()
  
  const chosen = (dishes ?? [])
    .map((dish) => ({ dish, quantity: dishQuantity[dish.id] ?? 0 }))
    .filter((q) => q.quantity > 0)

  const dishesTotal = chosen.reduce((p, d) => p + d.dish.price * d.quantity, 0)
  const total = zone.price + dishesTotal

  const handleConfirm = () => {
    create.mutate(
      {
        tableId: table.id,
        date: params.date,
        start: params.start,
        duration: params.duration,
        guests: params.guests,
        dishes: Object.entries(dishQuantity).map(([dishId, quantity]) => ({ dishId, quantity })),
      },
      { onSuccess: onCreated },
    )
  }
  return (
    <div className="reserve-confirm">
      <h3>подтверждение</h3>
      <ul className="reserve-confirm__list">
        <li>
          Стол №{table.number} - {zone.name}
        </li>
        <li>
          {params.date} - {params.start} - {params.duration / 60} часов
        </li>
        <li>
          гостей: {params.guests}
        </li>
        <li>
          Стоимость стола: {zone.price} ₽
        </li>
        {chosen.map((x) => (
          <li key={x.dish.id}>
            {x.dish.name} * {x.quantity} — {x.dish.price * x.quantity} ₽
          </li>
        ))}
      </ul>
      <p className="reserve-confirm__total">
        Общая стоимость: {total} ₽
      </p>
      {create.isError && (
        <p className="reserve-confirm__error">
          ошибка
        </p>
      )}
      <div className="reserve-confirm__nav">
        <button type="button" onClick={onBack}>
          Back
        </button>
        {isAuthed ? (
          <button type="button" onClick={handleConfirm} disabled={create.isPending}>
            {create.isPending ? 'Создание' : 'Подтверждение'}
          </button>
        ) : (
          <Link className="reserve-confirm__login" to="/login">залогиниться</Link>
        )}
      </div>
    </div>
  )
}
