import { IMaskInput } from 'react-imask'

const EMPTY_UNMASKED_VALUE = '7'

function PhoneInput({ value, onChange, onBlur, name }: {
  value?: string
  onChange: (value: string) => void
  onBlur?: () => void
  name?: string
}) {
  return (
    <IMaskInput
      autoComplete='tel'
      inputMode='tel'
      name={name}
      mask='+{7} (000) 000-00-00'
      type='tel'
      lazy={false}
      value={value ?? ''}
      onAccept={(maskedValue, mask) => {
        onChange(mask.unmaskedValue === EMPTY_UNMASKED_VALUE ? '' : maskedValue)
      }}
      onBlur={onBlur}
      placeholder='+7 (___) ___-__-__'
    />
  )
}

export default PhoneInput
