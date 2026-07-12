import type { AvailabilityParams, AvailabilityTable, AvailabilityZone, MasterOption, MasterSessionType } from '@/entities/Reservation'
import { useTranslation } from 'react-i18next'
import {
  buildDurationOptionsForSlot,
  buildStartOptionsForDate,
  getReservationWindowIssue,
} from '@/shared/lib/time'
import { todayStr } from './options'
import { HallMap } from './HallMap'
import { ZoneList } from './ZoneList'
import { TodayPerformance } from './TodayPerformance'
import { useNewsList } from '@/entities/News'
import { Dropdown, ErrorPlug, Loader } from '@/shared/ui'

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
  const { t } = useTranslation(['reservation', 'common'])
  const selectedMaster = masters.find((master) => master.id === masterId)

  const startOptions = buildStartOptionsForDate(params.date)
  const durationOptions = buildDurationOptionsForSlot(params.date, params.start)
  const windowIssue = getReservationWindowIssue(params)

  const { data: performanceData } = useNewsList('PERFORMANCE')
  const reservationStart = new Date(`${params.date}T${params.start}:00+05:00`)
  const reservationEnd = new Date(reservationStart.getTime() + params.duration * 60000)
  const activePerformance = (performanceData ?? []).find((item) => {
    if (!item.startsAt || !item.endsAt) {
      return false
    }
    return new Date(item.startsAt) < reservationEnd && new Date(item.endsAt) > reservationStart
  })

  return (
    <>
      <form className='reserve__filters' onSubmit={(e) => e.preventDefault()}>
        <div className='reserve__filter'>
          <label className='reserve__label'>
            {t('reservation:filters.date')}
          </label>
          <div className='input-parchment-wrapper'>
            <input
              className='reserve-input'
              type='date'
              min={todayStr()}
              value={params.date}
              onChange={(e) => onUpdate({ date: e.target.value })}
            />
          </div>
        </div>

        <Dropdown
          options={startOptions.map((time) => ({ value: time, label: time }))}
          value={params.start}
          onChange={(value) => onUpdate({ start: value })}
          label={t('reservation:filters.time')}
        />

        <Dropdown
          options={durationOptions.map((item) => ({ value: String(item.value), label: item.label }))}
          value={String(params.duration)}
          onChange={(value) => onUpdate({ duration: Number(value) })}
          label={t('reservation:filters.duration')}
        />

        <div className='reserve__filter'>
          <label className='reserve__label'>
            {t('reservation:filters.guests')}
          </label>
          <div className='input-parchment-wrapper'>
            <input
              className='reserve-input'
              type='number'
              min={1}
              value={params.guests}
              onChange={(e) => onUpdate({ guests: Math.max(1, Number(e.target.value)) })}
            />
          </div>
        </div>
      </form>

      {windowIssue &&
        <p className='reserve__validation' role='alert'>
          {t(`reservation:validation.${windowIssue}`)}
        </p>
      }

      <div className='reserve__summary'>
        {selectedTable && selectedZone ? (
          <p className='reserve__text-info'>
            {t('reservation:summary.table')} <b>№{selectedTable.number}</b> - {selectedZone.name} |
            {t('reservation:summary.upTo', { capacity: selectedTable.capacity })} |
            <b> {selectedZone.price} ₽</b> {t('reservation:summary.forHours', { hours: params.duration / 60 })}
          </p>
        ) : (
          <p className='reserve__text-info'>
            {t('reservation:summary.selectTable')}
          </p>
        )}
        <button
          type='button'
          className='reserve__button reserve__shadow'
          disabled={!selectedId || Boolean(masterId && !masterSessionType) || Boolean(windowIssue) || durationOptions.length === 0}
          onClick={onNext}
        >
          {t('reservation:actions.next')}
        </button>
      </div>

      <div className='reserve__visual'>
        <div className='reserve__top-row'>
          <div className='reserve__master'>
            <div className='reserve__master-avatar'>
              {selectedMaster?.image ? (
                <img src={selectedMaster.image} alt={selectedMaster.name} />
              ) : (
                <span>{t('reservation:master.photo')}</span>
              )}
            </div>
            {selectedMaster?.bio &&
              <p className='reserve__master-bio'>
                {selectedMaster.bio}
              </p>
            }
            <div className='reserve__master-info'>
              <Dropdown
                options={[
                  { value: '', label: t('reservation:master.none') },
                  ...masters.map((master) => ({
                    value: master.id,
                    label: `${master.name}${master.available ? '' : ` ${t('reservation:master.busy')}`}`,
                    disabled: !master.available,
                  })),
                ]}
                value={masterId}
                onChange={(value) => onSelectMaster(value)}
                label={t('reservation:master.label')}
              />

              {masterId && (
                <Dropdown
                  options={masterPrices ? [
                    { value: 'ONESHOT', label: t('reservation:master.sessionOneshot', { price: masterPrices.oneshot }) },
                    { value: 'CAMPAIGN', label: t('reservation:master.sessionCampaign', { price: masterPrices.campaign }) },
                  ] : []}
                  value={masterSessionType}
                  onChange={(value) => onSelectMasterSessionType(value as MasterSessionType | '')}
                  placeholder={t('reservation:master.selectType')}
                  label={t('reservation:master.sessionType')}
                />
              )}
            </div>
          </div>

          <TodayPerformance date={params.date} />
        </div>

        <div className='reserve__map'>
          <div className='reserve__legend' role='group' aria-label={t('reservation:a11y.mapLegend')}>
            <div className='reserve__legend-item'>
              <div className='reserve__legend-item--free' aria-hidden='true' />
              <span>{t('reservation:legend.free')}</span>
            </div>
            <div className='reserve__legend-item'>
              <div className='reserve__legend-item--busy' aria-hidden='true' />
              <span>{t('reservation:legend.busy')}</span>
            </div>
            <div className='reserve__legend-item'>
              <div className='reserve__legend-item--small' aria-hidden='true' />
              <span>{t('reservation:legend.small')}</span>
            </div>
          </div>
          {isLoading &&
            <Loader width='100px' height='100px' />
          }
          {isError &&
            <ErrorPlug />
          }
          <HallMap
            tables={allTables}
            selectedId={selectedId}
            onSelect={onSelectTable}
            showStage={!!activePerformance}
            stageImage={activePerformance?.image}
          />
          <div className='hall-list'>
            {zones.map((zone) => (
              <ZoneList
                key={zone.id}
                zone={zone}
                selectedId={selectedId}
                onSelect={onSelectTable}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
