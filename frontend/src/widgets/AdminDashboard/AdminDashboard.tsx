import './AdminDashboard.scss'
import { useState } from 'react'
import { DishAdminList, NewsAdminList, ReservationAdminList, UserAdminList, TableAdminList } from './EntitiesLists'

type EntityKey = 'news' | 'reservation' | 'dish' | 'user' | 'table'

const ENTITIES: { key: EntityKey; label: string }[] = [
  { key: 'news', label: 'Новости' },
  { key: 'reservation', label: 'Брони' },
  { key: 'dish', label: 'Блюда' },
  { key: 'user', label: 'Пользователи' },
  { key: 'table', label: 'Столики' },
]

function AdminDashboard() {
  const [entity, setEntity] = useState<EntityKey>('news')

  return (
    <section className='admin-dashboard'>
      <h1 className='admin-dashboard__title'>
        АДМИН
      </h1>

      <div className='admin-dashboard__entities'>
        {ENTITIES.map((e) => (
          <button
            key={e.key}
            className={entity === e.key ? 'is-active' : ''}
            onClick={() => setEntity(e.key)}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div>
        {entity === 'news' && <NewsAdminList />}
        {entity === 'reservation' && <ReservationAdminList />}
        {entity === 'dish' && <DishAdminList />}
        {entity === 'user' && <UserAdminList />}
        {entity === 'table' && <TableAdminList />}
      </div>
    </section>
  )
}

export default AdminDashboard
