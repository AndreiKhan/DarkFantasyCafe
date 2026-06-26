import type { AvailabilityTable } from '@/entities/Reservation'

function tableClass(table: AvailabilityTable, selectedId: string | null): string {
  const classStyle = ['hall-map__table']

  if (table.id === selectedId) {
    classStyle.push('hall-map__table--selected')
  }
  if (!table.available) {
    classStyle.push('hall-map__table--busy')
  }
  else if (!table.fitsGuests) {
    classStyle.push('hall-map__table--busy')
  }

  return classStyle.join(' ')
}

export function HallMap({ tables, selectedId, onSelect }: {
  tables: AvailabilityTable[]
  selectedId: string | null
  onSelect: (table: AvailabilityTable) => void
}) {
  return (
    <div className="hall-map">
      {tables.map((table) => (
        <div
          key={table.id}
          className={tableClass(table, selectedId)}
          style={{
            top: `${table.y}%`,
            left: `${table.x}%`,
          }}
          onClick={() => onSelect(table)}
        >
          <p>
            {table.number}
          </p>
        </div>
      ))}
    </div>
  )
}
