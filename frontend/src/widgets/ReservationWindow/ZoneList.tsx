import type { AvailabilityTable, AvailabilityZone } from '@/entities/Reservation'

export function ZoneList({ zone, selectedId, onSelect }: {
  zone: AvailabilityZone
  selectedId: string | null
  onSelect: (table: AvailabilityTable) => void
}) {
  return (
    <div className="hall-list__zone">
      <h3 className="hall-list__zone-title">{zone.name} - {zone.price} ₽</h3>
      <div className="hall-list__tables">
        {zone.tables.map((table) => (
          <button
            key={table.id}
            type="button"
            disabled={!table.available || !table.fitsGuests}
            className={`hall-list__table ${table.id === selectedId ? 'hall-list__table--selected' : ''}`}
            onClick={() => onSelect(table)}
          >
            №{table.number} - до {table.capacity}
            {!table.available &&
              ' · busy'
            }
            {table.available &&
              !table.fitsGuests && ' · small'
            }
          </button>
        ))}
      </div>
    </div>
  )
}
