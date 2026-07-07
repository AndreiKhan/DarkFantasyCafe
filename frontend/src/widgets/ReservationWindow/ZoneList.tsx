import type { AvailabilityTable, AvailabilityZone } from '@/entities/Reservation'
import { useTranslation } from 'react-i18next'

export function ZoneList({ zone, selectedId, onSelect }: {
  zone: AvailabilityZone
  selectedId: string | null
  onSelect: (table: AvailabilityTable) => void
}) {
  const { t } = useTranslation('reservation')

  return (
    <div className='hall-list__zone'>
      <h3 className='hall-list__zone-title'>{zone.name} - {zone.price} ₽</h3>
      <div className='hall-list__tables'>
        {zone.tables.map((table) => (
          <button
            key={table.id}
            type='button'
            disabled={!table.available || !table.fitsGuests}
            className={`hall-list__table ${table.id === selectedId ? 'hall-list__table--selected' : ''}`}
            onClick={() => onSelect(table)}
          >
            {t('zoneList.table', { number: table.number, capacity: table.capacity })}
            {!table.available &&
              t('zoneList.busy')
            }
            {table.available &&
              !table.fitsGuests && t('zoneList.small')
            }
          </button>
        ))}
      </div>
    </div>
  )
}
