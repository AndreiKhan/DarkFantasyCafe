import type { AvailabilityParams, AvailabilityTable, AvailabilityZone, MasterOption, MasterSessionType, ReservationSummary } from '@/entities/Reservation'
import { useCreateReservation } from '@/entities/Reservation'
import { useDishes } from '@/entities/Dish'
import { useTranslation } from 'react-i18next'
import { getApiErrorMessage } from '@/shared/lib/apiError'
import { Loader } from '@/shared/ui'

export function StepConfirm({ params, table, zone, dishQuantity, masterId, masterSessionType, master, masterPrices, onBack, onCreated }: {
  params: AvailabilityParams
  table: AvailabilityTable
  zone: AvailabilityZone
  dishQuantity: Record<string, number>
  masterId: string
  masterSessionType: MasterSessionType | ''
  master: MasterOption | null
  masterPrices?: { oneshot: number; campaign: number }
  onBack: () => void
  onCreated: (reserve: ReservationSummary) => void
}) {
  const { data: dishes } = useDishes({ tags: [], allergens: [] })
  const create = useCreateReservation()
  const { t } = useTranslation(['reservation', 'common'])

  const chosen = (dishes ?? [])
    .map((dish) => ({ dish, quantity: dishQuantity[dish.id] ?? 0 }))
    .filter((q) => q.quantity > 0)

  const dishesTotal = chosen.reduce((p, d) => p + d.dish.price * d.quantity, 0)

  const masterTotal = masterId && masterSessionType && masterPrices
    ? (masterSessionType === 'CAMPAIGN' ? masterPrices.campaign : masterPrices.oneshot)
    : 0

  const sessionLabel = masterSessionType === 'CAMPAIGN'
    ? t('reservation:master.sessionCampaignShort')
    : masterSessionType === 'ONESHOT'
      ? t('reservation:master.sessionOneshotShort')
      : ''

  const total = zone.price + dishesTotal + masterTotal

  const handleConfirm = () => {
    create.mutate(
      {
        tableId: table.id,
        masterId: masterId || null,
        masterSessionType: masterId && masterSessionType ? masterSessionType : null,
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
    <div className='reserve-confirm'>
      <div className='reserve-confirm__container'>
        <h3 className='reserve-confirm__title'>
          {t('reservation:confirm.title')}
        </h3>

        <ul className='reserve-confirm__list'>
          <li className='reserve-confirm__item'>
            {t('reservation:confirm.table', { number: table.number, zoneName: zone.name })}
          </li>
          <li className='reserve-confirm__item'>
            {t('reservation:confirm.datetime', { date: params.date, start: params.start, hours: params.duration / 60 })}
          </li>
          <li className='reserve-confirm__item'>
            {t('reservation:confirm.guests', { count: params.guests })}
          </li>
          {master && masterSessionType && (
            <li className='reserve-confirm__item'>
              {t('reservation:confirm.master', { name: master.name, sessionType: sessionLabel, price: masterTotal })}
            </li>
          )}
          <li className='reserve-confirm__item'>
            {t('reservation:confirm.tableCost', { price: zone.price })}
          </li>
          {chosen.map((x) => (
            <li className='reserve-confirm__item' key={x.dish.id}>
              {x.dish.name} * {x.quantity} — {x.dish.price * x.quantity} ₽
            </li>
          ))}
        </ul>
        <p className='reserve-confirm__total'>
          {t('reservation:confirm.total', { total })}
        </p>
        {create.isError && (
          <p className='reserve-confirm__error' role='alert'>
            {getApiErrorMessage(create.error, t)}
          </p>
        )}

        <div className='reserve-confirm__nav'>
          <button className='reserve__button' type='button' onClick={onBack}>
            {t('reservation:actions.back')}
          </button>
          <button className='reserve__button--confirm' type='button' onClick={handleConfirm} disabled={create.isPending}>
            {create.isPending ? <Loader width='30px' height='30px'/> : t('common:actions.confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}
