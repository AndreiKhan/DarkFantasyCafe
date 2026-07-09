import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useReservationStatus } from '@/entities/Reservation'
import { useTrackAchievement } from '@/entities/Achievement'
import './ReservationSuccessPage.scss'

function ReservationSuccessPage() {
  const [sp] = useSearchParams()
  const id = sp.get('reservationId') ?? ''
  const { t } = useTranslation('reservation')
  const { data } = useReservationStatus(id)
  const trackAchievement = useTrackAchievement()
  const tracked = useRef(false)

  useEffect(() => {
    if (data?.status !== 'CONFIRMED' || tracked.current) return
    tracked.current = true
    trackAchievement.mutate('first_reservation')
  }, [data?.status])

  if (!id) {
    return <section className='center reserve-success__not'>
      <h1 className='reserve-success__title'>
        {t('success.noReservation')}
      </h1>
    </section>
  }

  const status = data?.status

  return (
    <section className='center reserve-success'>
      {status === 'CONFIRMED' &&
        <h1 className='reserve-success__title'>
          {t('success.confirmed')}
        </h1>
      }
      {status === 'CANCELLED' && (
        <h1 className='reserve-success__title'>
          {t('success.error')}
        </h1>
      )}
      {(!status || status === 'PENDING_PAYMENT' || status === 'DRAFT') &&
        <h1 className='reserve-success__title'>
          {t('success.checking')}
        </h1>
      }
    </section>
  )
}

export default ReservationSuccessPage
