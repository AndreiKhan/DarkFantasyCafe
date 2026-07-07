import Dropdown from '../Dropdown/Dropdown'
import { buildTimeSlots } from '@/shared/lib/time'
import { toDatetimeLocal, fromDatetimeLocal } from '@/shared/lib/datetime'

const SLOT_OPTIONS = buildTimeSlots().map((slot) => ({ value: slot, label: slot }))

function DateTimeField({ label, value, onChange, error }: {
  label: string
  value: string | null
  onChange: (iso: string | null) => void
  error?: string
}) {
  const local = toDatetimeLocal(value)
  const [datePart, timePart] = local ? local.split('T') : ['', '']

  const emit = (date: string, time: string) =>
    onChange(date && time ? fromDatetimeLocal(`${date}T${time}`) : null)

  return (
    <div className='datetime-field'>
      <span>
        {label}
      </span>
      <input
        type='date'
        value={datePart}
        onChange={(e) => emit(e.target.value, timePart || SLOT_OPTIONS[0].value)}
      />
      <Dropdown
        options={SLOT_OPTIONS}
        value={timePart || null}
        placeholder='Время'
        onChange={(time) => emit(datePart, time)}
      />
      {error &&
        <span className='admin-form__error'>
          {error}
        </span>
      }
    </div>
  )
}

export default DateTimeField
