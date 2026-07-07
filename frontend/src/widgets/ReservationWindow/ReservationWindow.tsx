import { useCallback, useEffect, useState } from 'react'
import './ReservationWindow.scss'
import { useTranslation } from 'react-i18next'
import { useAvailability, useMasters, type AvailabilityParams, type AvailabilityTable, type MasterSessionType, type ReservationSummary } from '@/entities/Reservation'
import { todayStr } from './options'
import { StepWindow } from './StepWindow'
import { StepDishes } from './StepDishes'
import { StepConfirm } from './StepConfirm'
import { StepPayment } from './StepPayment'
import SectionDecoratedTitle from '@/shared/ui/SectionDecoratedTitle/SectionDecoratedTitle'
import Modal from '@/shared/ui/Modal/Modal'

type Step = 1 | 2 | 3

type Draft = {
  params: AvailabilityParams
  selectedId: string | null
  masterId: string
  masterSessionType: MasterSessionType | ''
  step: Step
  dishQuantity: Record<string, number>
}

const DRAFT_KEY = 'reservation-draft'

function loadDraft(): Partial<Draft> {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? '{}')
  }
  catch {
    return {}
  }
}

function ReservationWindow() {
  const { t } = useTranslation('reservation')
  const [draft] = useState(loadDraft)

  const [params, setParams] = useState<AvailabilityParams>(draft.params ?? {
    date: todayStr(),
    start: '18:00',
    duration: 60,
    guests: 2,
  })

  const [selectedId, setSelectedId] = useState<string | null>(draft.selectedId ?? null)
  const [masterId, setMasterId] = useState<string>(draft.masterId ?? '')
  const [masterSessionType, setMasterSessionType] = useState<MasterSessionType | ''>(draft.masterSessionType ?? '')
  const [step, setStep] = useState<Step>(draft.step ?? 1)
  const [dishQuantity, setDishQuantity] = useState<Record<string, number>>(draft.dishQuantity ?? {})
  const [reservation, setReservation] = useState<ReservationSummary | null>(null)

  useEffect(() => {
    const draft: Draft = { params, selectedId, masterId, masterSessionType, step, dishQuantity }
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  }, [params, selectedId, masterId, masterSessionType, step, dishQuantity])

  const { data, isLoading, isError } = useAvailability(params)
  const zones = data?.zones ?? []
  const allTables = zones.flatMap((zone) => zone.tables)

  const { data: mastersData } = useMasters({
    date: params.date,
    start: params.start,
    duration: params.duration,
  })
  const masterList = mastersData?.masters ?? []
  const masterPrices = mastersData?.prices

  useEffect(() => {
    if (!selectedId) {
      return
    }

    const table = allTables.find((t) => t.id === selectedId)

    if (!table || !table.available || !table.fitsGuests) {
      setSelectedId(null)
    }
  }, [data])

  useEffect(() => {
    if (!masterId) {
      return
    }

    const master = masterList.find((m) => m.id === masterId)

    if (!master || !master.available) {
      setMasterId('')
      setMasterSessionType('')
    }
  }, [mastersData])

  const selectMaster = (id: string) => {
    setMasterId(id)
    if (!id) {
      setMasterSessionType('')
    }
  }

  const update = (patch: Partial<AvailabilityParams>) => setParams((p) => ({ ...p, ...patch }))

  const selectTable = (table: AvailabilityTable) => {
    if (!table.available || !table.fitsGuests) {
      return
    }
    setSelectedId(table.id)
  }

  const setQuantity = useCallback((dishId: string, quantity: number) => {
    setDishQuantity((prev) => {
      const next = { ...prev }

      if (quantity <= 0) {
        delete next[dishId]
      }
      else {
        next[dishId] = quantity
      }

      return next
    })
  }, [])

  const selectedZone = zones.find((zone) => zone.tables.some((table) => table.id === selectedId))
  const selectedTable = allTables.find((table) => table.id === selectedId)

  return (
    <section className='reserve'>
      <div className='center'>
        <SectionDecoratedTitle title={t('title')}/>

        {step === 1 && (
          <StepWindow
            params={params}
            onUpdate={update}
            zones={zones}
            allTables={allTables}
            selectedId={selectedId}
            selectedTable={selectedTable}
            selectedZone={selectedZone}
            onSelectTable={selectTable}
            masters={masterList}
            masterPrices={masterPrices}
            masterId={masterId}
            onSelectMaster={selectMaster}
            masterSessionType={masterSessionType}
            onSelectMasterSessionType={setMasterSessionType}
            isLoading={isLoading}
            isError={isError}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepDishes
            dishQuantity={dishQuantity}
            setQuantity={setQuantity}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && selectedTable && selectedZone && (
          <StepConfirm
            params={params}
            table={selectedTable}
            zone={selectedZone}
            dishQuantity={dishQuantity}
            masterId={masterId}
            masterSessionType={masterSessionType}
            master={masterList.find((m) => m.id === masterId) ?? null}
            masterPrices={masterPrices}
            onBack={() => setStep(2)}
            onCreated={(r) => { sessionStorage.removeItem(DRAFT_KEY); setReservation(r) }}
          />
        )}
      </div>

      <Modal isOpen={!!reservation} onClose={() => setReservation(null)}>
        {reservation && <StepPayment reservation={reservation} />}
      </Modal>
    </section>
  )
}

export default ReservationWindow
