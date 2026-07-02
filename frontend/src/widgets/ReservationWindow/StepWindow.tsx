import type { AvailabilityParams, AvailabilityTable, AvailabilityZone, MasterOption, MasterSessionType } from '@/entities/Reservation'
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
  masters,
  masterPrices,
  masterId,
  onSelectMaster,
  masterSessionType,
  onSelectMasterSessionType,
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
  masters: MasterOption[]
  masterPrices?: { oneshot: number; campaign: number }
  masterId: string
  onSelectMaster: (id: string) => void
  masterSessionType: MasterSessionType | ''
  onSelectMasterSessionType: (type: MasterSessionType | '') => void
  isLoading: boolean
  isError: boolean
  onNext: () => void
}) {
  return (
    <>
      <div className="reserve__master">
        <span>Мастер</span>
        <select
          className="reserve-input"
          value={masterId}
          onChange={(e) => onSelectMaster(e.target.value)}
        >
          <option value="">Без мастера</option>
          {masters.map((master) => (
            <option key={master.id} value={master.id} disabled={!master.available}>
              {master.name}{master.available ? '' : ' (занят)'}
            </option>
          ))}
        </select>
      </div>

      {masterId && (
        <div className="reserve__master">
          <span>Тип истории</span>
          <select
            className="reserve-input"
            value={masterSessionType}
            onChange={(e) => onSelectMasterSessionType(e.target.value as MasterSessionType | '')}
          >
            <option value="">Выберите тип</option>
            {masterPrices && (
              <>
                <option value="ONESHOT">Короткая (oneshot) — {masterPrices.oneshot} ₽</option>
                <option value="CAMPAIGN">Длинная (кампания) — {masterPrices.campaign} ₽</option>
              </>
            )}
          </select>
        </div>
      )}

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
          disabled={!selectedId || Boolean(masterId && !masterSessionType)}
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
