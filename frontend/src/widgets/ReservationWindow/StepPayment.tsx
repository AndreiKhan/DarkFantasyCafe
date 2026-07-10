import { usePayReservation, type ReservationSummary } from '@/entities/Reservation'
import { useTranslation } from 'react-i18next'
import { getApiErrorMessage } from '@/shared/lib/apiError'
import { Loader } from '@/shared/ui'

export function StepPayment({ reservation }: { reservation: ReservationSummary }) {
  const pay = usePayReservation()
  const { t } = useTranslation(['reservation', 'common'])

  const handlePay = () => {
    pay.mutate(reservation.id, {
      onSuccess: ({ confirmationUrl }) => {
        if (confirmationUrl) {
          window.location.href = confirmationUrl
        }
      },
    })
  }

  return (
    <div className='reserve-payment'>
      <p className='reserve-payment__text'>
        {t('reservation:payment.total')} <br/>
        {reservation.totalAmount} ₽
      </p>
      {pay.isError &&
        <p className='reserve-confirm__error' role='alert'>
          {getApiErrorMessage(pay.error, t)}
        </p>
      }
      <button className='reserve__button--confirm' type='button' onClick={handlePay} disabled={pay.isPending}>
        {pay.isPending ? <Loader width='30px' height='30px'/> : t('common:actions.pay')}
      </button>
    </div>
  )
}

