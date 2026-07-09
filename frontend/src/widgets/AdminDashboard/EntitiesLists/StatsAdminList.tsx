import './StatsAdminList.scss'
import { useMemo, useState } from 'react'
import { useAdminStats } from '@/entities/Stats'
import { ErrorPlug, Loader } from '@/shared/ui'

function defaultRange() {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 30)
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  }
}

function StatsAdminList() {
  const [range, setRange] = useState(defaultRange)
  const [query, setQuery] = useState(defaultRange)
  const { data, isLoading, isError } = useAdminStats(query)

  const maxDayCount = useMemo(
    () => Math.max(1, ...(data?.reservationsByDay.map((item) => item.count) ?? [1])),
    [data],
  )

  if (isLoading) {
    return <Loader width='120px' height='120px' />
  }
  if (isError || !data) {
    return <ErrorPlug />
  }

  return (
    <div className='admin-stats'>
      <div className='admin-stats__filters'>
        <label className='admin-stats__field'>
          С
          <input
            className='admin-stats__input'
            type='date'
            value={range.from}
            onChange={(e) => setRange((prev) => ({ ...prev, from: e.target.value }))}
          />
        </label>
        <label className='admin-stats__field'>
          По
          <input
          className='admin-stats__input'
            type='date'
            value={range.to}
            onChange={(e) => setRange((prev) => ({ ...prev, to: e.target.value }))}
          />
        </label>
        <button type='button' className='admin-stats__button' onClick={() => setQuery(range)}>
          Показать
        </button>
      </div>

      <div className='admin-stats__cards'>
        <div className='admin-stats__card'>
          <span className='admin-stats__card-label'>Броней</span>
          <strong className='admin-stats__card-value'>{data.reservationsTotal}</strong>
        </div>
        <div className='admin-stats__card'>
          <span className='admin-stats__card-label'>Подтверждено</span>
          <strong className='admin-stats__card-value'>{data.reservationsConfirmed}</strong>
        </div>
        <div className='admin-stats__card'>
          <span className='admin-stats__card-label'>Выручка</span>
          <strong className='admin-stats__card-value'>{data.totalRevenue} ₽</strong>
        </div>
      </div>

      <section className='admin-stats__section'>
        <h2 className='admin-stats__title'>Брони по дням</h2>
        {data.reservationsByDay.length === 0 ? (
          <p className='admin-stats__empty'>Нет данных за период</p>
        ) : (
          <ul className='admin-stats__bars'>
            {data.reservationsByDay.map((item) => (
              <li key={item.date} className='admin-stats__bar-row'>
                <span className='admin-stats__bar-date'>{item.date}</span>
                <div className='admin-stats__bar-track'>
                  <div
                    className='admin-stats__bar-fill'
                    style={{ width: `${(item.count / maxDayCount) * 100}%` }}
                  />
                </div>
                <span className='admin-stats__bar-count'>{item.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className='admin-stats__section'>
        <h2 className='admin-stats__title'>Топ блюд</h2>
        <div className='admin-stats__table-wrapper'>
          <table className='admin-stats__table'>
            <thead>
              <tr>
                <th>#</th>
                <th>Блюдо</th>
                <th>Заказов</th>
              </tr>
            </thead>
            <tbody>
              {data.popularDishes.length === 0 ? (
                <tr>
                  <td colSpan={3} className='admin-stats__empty'>Нет данных за период</td>
                </tr>
              ) : (
                data.popularDishes.map((dish, index) => (
                  <tr key={dish.name}>
                    <td>{index + 1}</td>
                    <td>{dish.name}</td>
                    <td>{dish.quantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default StatsAdminList
