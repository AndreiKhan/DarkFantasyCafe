import './AdminDashboard.scss'
import { useState } from 'react'
import {
  DishAdminList,
  NewsAdminList,
  ReservationAdminList,
  UserAdminList,
  TableAdminList,
  FaqAdminList,
  ContactRequestAdminList,
  CharacterAdminList,
} from './EntitiesLists'

type EntityKey = 'news' | 'reservation' | 'dish' | 'user' | 'table' | 'faq' | 'contactRequest' | 'character'

const ENTITIES: { key: EntityKey; label: string }[] = [
  { key: 'news', label: 'Новости' },
  { key: 'reservation', label: 'Брони' },
  { key: 'dish', label: 'Блюда' },
  { key: 'user', label: 'Пользователи' },
  { key: 'table', label: 'Столики' },
  { key: 'faq', label: 'FAQ' },
  { key: 'contactRequest', label: 'Заявки' },
  { key: 'character', label: 'Персонажи' },
]

function AdminDashboard() {
  const [entity, setEntity] = useState<EntityKey>('news')

  return (
    <section className='admin-dashboard'>
      <div className='center'>
        <h1 className='admin-dashboard__title'>
          АДМИН
        </h1>

        <div className='admin-dashboard__entities'>
          {ENTITIES.map((e) => (
            <button
              key={e.key}
              type='button'
              className={`admin-dashboard__entity ${entity === e.key ? 'admin-dashboard__entity--active' : ''}`}
              onClick={() => setEntity(e.key)}
            >
              {e.label}
            </button>
          ))}
        </div>

        <div className='admin-dashboard__content'>
          {entity === 'news' && <NewsAdminList />}
          {entity === 'reservation' && <ReservationAdminList />}
          {entity === 'dish' && <DishAdminList />}
          {entity === 'user' && <UserAdminList />}
          {entity === 'table' && <TableAdminList />}
          {entity === 'faq' && <FaqAdminList />}
          {entity === 'contactRequest' && <ContactRequestAdminList />}
          {entity === 'character' && <CharacterAdminList />}
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard
