import { useSearchParams } from 'react-router-dom'
import { useReservationStatus } from '@/entities/Reservation'

function ReservationSuccessPage() {
  const [sp] = useSearchParams()
  const id = sp.get('reservationId') ?? ''
  const { data } = useReservationStatus(id)

  if (!id) {
    return <section className="center">
      <p>
        No reservation
      </p>
    </section>
  }

  const status = data?.status

  return (
    <section className="center">
      {status === 'CONFIRMED' &&
        <h1>
          Зарезервировано
        </h1>
      }
      {status === 'CANCELLED' && (
        <h1>
          Ошибка
        </h1>
      )}
      {(!status || status === 'PENDING_PAYMENT' || status === 'DRAFT') &&
        <p>
          Проверка
        </p>
      }
    </section>
  )
}

export default ReservationSuccessPage