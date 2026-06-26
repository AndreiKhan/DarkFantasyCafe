import type { AvailabilityParams, AvailabilityTable, AvailabilityZone } from '@/entities/Reservation'
import { buildStartOptions, buildDurationOptions, todayStr } from './options'
import { HallMap } from './HallMap'
import { ZoneList } from './ZoneList'

const START_OPTIONS = buildStartOptions()
const DURATION_OPTIONS = buildDurationOptions()

export function StepWindow({
  params,
  onUpdate,
  zones,
  allTables,
  selectedId,
  selectedTable,
  selectedZone,
  onSelectTable,
  isLoading,
  isError,
  onNext,
}: {
  params: AvailabilityParams
  onUpdate: (patch: Partial<AvailabilityParams>) => void
  zones: AvailabilityZone[]
  allTables: AvailabilityTable[]
  selectedId: string | null
  selectedTable: AvailabilityTable | undefined
  selectedZone: AvailabilityZone | undefined
  onSelectTable: (table: AvailabilityTable) => void
  isLoading: boolean
  isError: boolean
  onNext: () => void
}) {
  return (
    <>
      <div className="reserve__summary">
        {selectedTable && selectedZone ? (
          <p>
            Стол №{selectedTable.number} - {selectedZone.name} - до {selectedTable.capacity}<br/>
            <b>{selectedZone.price} ₽</b> за {params.duration / 60} часов<br/><br/>
          </p>
        ) : (
          <p>Выбрать стол</p>
        )}
        <button
          type="button"
          className="reserve__next"
          disabled={!selectedId}
          onClick={onNext}
        >
          дальше
        </button>
      </div>

      <form className="reserve__filters" onSubmit={(e) => e.preventDefault()}>
        <span>дата</span>
        <input
          className='reserve-input'
          type="date"
          min={todayStr()}
          value={params.date}
          onChange={(e) => onUpdate({ date: e.target.value })}
        />

        <span>Время</span>
        <select
          className='reserve-input'
          value={params.start}
          onChange={(e) => onUpdate({ start: e.target.value })}
        >
          {START_OPTIONS.map((time) =>
            <option key={time} value={time}>
              {time}
            </option>
          )}
        </select>

        <span>Длительность</span>
        <select
          className='reserve-input'
          value={params.duration}
          onChange={(e) => onUpdate({ duration: Number(e.target.value) })}
        >
          {DURATION_OPTIONS.map((dish) =>
            <option key={dish.value} value={dish.value}>
              {dish.label}
            </option>
          )}
        </select>

        <span>количество гостей</span>
        <input
          className='reserve-input'
          type="number"
          min={1}
          value={params.guests}
          onChange={(e) => onUpdate({ guests: Math.max(1, Number(e.target.value)) })}
        />
      </form>

      <div className="reserve__legend">
        <div>
          <div className="reserve__legend-item reserve__legend-item--free" />
          Свободно
        </div>
        <div>
          <div className="reserve__legend-item reserve__legend-item--busy" />
          Занято
        </div>
        <div>
          <div className="reserve__legend-item reserve__legend-item--small" />
          Мало мест
        </div>
      </div>

      {isLoading &&
        <p>загрущка</p>
      }
      {isError &&
        <p>ошибка</p>
      }

      <HallMap tables={allTables} selectedId={selectedId} onSelect={onSelectTable} />

      <div className="hall-list">
        {zones.map((zone) => (
          <ZoneList
            key={zone.id}
            zone={zone}
            selectedId={selectedId}
            onSelect={onSelectTable}
          />
        ))}
      </div>
    </>
  )
}
