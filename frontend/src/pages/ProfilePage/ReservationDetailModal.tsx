import { useTranslation } from 'react-i18next'
import { Modal } from '@/shared/ui'
import { formatDateTime } from '@/shared/lib/datetime'
import type { ReservationSummary } from '@/entities/Reservation'

function reservationHours(startsAt: string, endsAt: string) {
  const ms = new Date(endsAt).getTime() - new Date(startsAt).getTime()
  return Math.round(ms / (60 * 60 * 1000) * 10) / 10
}

type ReservationDetailModalProps = {
  reservation: ReservationSummary | null
  isOpen: boolean
  onClose: () => void
}

function ReservationDetailModal({ reservation, isOpen, onClose }: ReservationDetailModalProps) {
  const { t } = useTranslation(['profile', 'reservation'])

  if (!reservation) {
    return null
  }

  const hours = reservationHours(reservation.startsAt, reservation.endsAt)

  return (
    <Modal
      title={t('profile:reservations.detailTitle')}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='profile__reservation-modal'>
        <p className='profile__reservation-modal-row'>
          <strong>{t('reservation:summary.table')}:</strong>{' '}
          {t('reservation:confirm.table', {
            number: reservation.table.number,
            zoneName: reservation.table.zone,
          })}
        </p>
        <p className='profile__reservation-modal-row'>
          <strong>{t('profile:reservations.startsAt')}:</strong>{' '}
          {formatDateTime(reservation.startsAt)}
        </p>
        <p className='profile__reservation-modal-row'>
          <strong>{t('profile:reservations.endsAt')}:</strong>{' '}
          {formatDateTime(reservation.endsAt)}
        </p>
        <p className='profile__reservation-modal-row'>
          <strong>{t('reservation:filters.duration')}:</strong>{' '}
          {t('profile:reservations.hours', { count: hours })}
        </p>
        <p className='profile__reservation-modal-row'>
          <strong>{t('reservation:filters.guests')}:</strong>{' '}
          {reservation.guests}
        </p>

        {reservation.items.length > 0 && (
          <div className='profile__reservation-modal-items'>
            <strong>{t('profile:reservations.items')}:</strong>
            <ul className='profile__reservation-modal-list'>
              {reservation.items.map((item, index) => (
                <li key={`${item.title}-${index}`}>
                  {item.title} × {item.quantity} — {item.unitPrice * item.quantity} ₽
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className='profile__reservation-modal-total'>
          {t('reservation:confirm.total', { total: reservation.totalAmount })}
        </p>
      </div>
    </Modal>
  )
}

export default ReservationDetailModal
