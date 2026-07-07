import type { AvailabilityTable } from '@/entities/Reservation'
import { useTranslation } from 'react-i18next'

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

export function HallMap({ tables, selectedId, onSelect, showStage, stageImage }: {
  tables: AvailabilityTable[]
  selectedId: string | null
  onSelect: (table: AvailabilityTable) => void
  showStage?: boolean
  stageImage?: string | null
}) {
  const { t } = useTranslation(['common', 'reservation'])
  const isDisabled = (table: AvailabilityTable) => !table.available || !table.fitsGuests

  return (
    <div className='hall-map' role='group' aria-label={t('common:a11y.hallMap')}>
      {showStage &&
        <div className='hall-map__stage'>
          <div className='hall-map__shadow' />
          <div
            className='hall-map__stage-image'
            title={t('reservation:performance.stage')}
            aria-hidden='true'
            style={stageImage ? { backgroundImage: `url(${stageImage})` } : undefined}
          />
        </div>
      }
      {tables.map((table) => (
        <div
          key={table.id}
          role='button'
          tabIndex={isDisabled(table) ? -1 : 0}
          aria-label={t('common:a11y.selectTable', { number: table.number })}
          aria-pressed={table.id === selectedId}
          aria-disabled={isDisabled(table)}
          className={tableClass(table, selectedId)}
          style={{
            top: `${table.y}%`,
            left: `${table.x}%`,
          }}
          onClick={() => onSelect(table)}
          onKeyDown={(event) => {
            if ((event.key === 'Enter' || event.key === ' ') && !isDisabled(table)) {
              event.preventDefault()
              onSelect(table)
            }
          }}
        >
          <p>
            {table.number}
          </p>
        </div>
      ))}
    </div>
  )
}
