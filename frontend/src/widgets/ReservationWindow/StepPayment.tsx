import { usePayReservation, type ReservationSummary } from '@/entities/Reservation'

export function StepPayment({ reservation }: { reservation: ReservationSummary }) {
  const pay = usePayReservation()
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
    <div className="reserve-payment">
      <p>
        Общая плата: {reservation.totalAmount} ₽
      </p>
      {pay.isError &&
        <p className="reserve-confirm__error">
          ошибка
        </p>
      }
      <button type="button" onClick={handlePay} disabled={pay.isPending}>
        {pay.isPending ? 'переход' : 'Оплатить'}
      </button>
    </div>
  )
}
