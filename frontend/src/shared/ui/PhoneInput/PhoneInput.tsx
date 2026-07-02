import { IMaskInput } from 'react-imask'

function PhoneInput({ value, onChange, onBlur, name }: {
  value?: string
  onChange: (value: string) => void
  onBlur?: () => void
  name?: string
}) {
  return (
    <IMaskInput
      type="tel"
      name={name}
      mask="+{7} (000) 000-00-00"
      lazy={false}
      value={value ?? ''}
      onAccept={onChange}
      onBlur={onBlur}
      placeholder="+7 (___) ___-__-__"
    />
  )
}

export default PhoneInput
