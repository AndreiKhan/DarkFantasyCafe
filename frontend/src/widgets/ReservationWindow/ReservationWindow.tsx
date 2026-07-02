import { useCallback, useEffect, useState } from 'react'
import './ReservationWindow.scss'
import { useAvailability, useMasters, type AvailabilityParams, type AvailabilityTable, type MasterSessionType, type ReservationSummary } from '@/entities/Reservation'
import { todayStr } from './options'
import { StepWindow } from './StepWindow'
import { StepDishes } from './StepDishes'
import { StepConfirm } from './StepConfirm'
import { StepPayment } from './StepPayment'

type Step = 1 | 2 | 3 | 4

function ReservationWindow() {
  const [params, setParams] = useState<AvailabilityParams>({
    date: todayStr(),
    start: '18:00',
    duration: 60,
    guests: 2,
  })

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [masterId, setMasterId] = useState<string>('')
  const [masterSessionType, setMasterSessionType] = useState<MasterSessionType | ''>('')
  const [step, setStep] = useState<Step>(1)
  const [dishQuantity, setDishQuantity] = useState<Record<string, number>>({})
  const [reservation, setReservation] = useState<ReservationSummary | null>(null)

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
    <section className="reserve">
      <div className="center">
        <h2 className="reserve__title">
          Бронирование
        </h2>

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
            onCreated={(r) => {
              setReservation(r);
              setStep(4)
            }}
          />
        )}

        {step === 4 && reservation &&
          <StepPayment reservation={reservation} />
        }
      </div>
    </section>
  )
}

export default ReservationWindow
