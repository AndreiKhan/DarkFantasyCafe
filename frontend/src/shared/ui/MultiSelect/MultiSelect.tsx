import { useTranslation } from 'react-i18next'
import Dropdown from '../Dropdown/Dropdown'
import './MultiSelect.scss'

type Option = { value: string; label: string }

function MultiSelect({ options, value, onChange, placeholder, label, error }: {
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  label?: string
  error?: string
}) {
  const { t } = useTranslation('common')
  const labelByValue = new Map(options.map((option) => [option.value, option.label]))
  const availableOptions = options.filter((option) => !value.includes(option.value))

  const remove = (item: string) => {
    onChange(value.filter((v) => v !== item))
  }

  return (
    <div className='multi-select'>
      {value.length > 0 &&
        <ul className='multi-select__tags'>
          {value.map((item) => (
            <li key={item} className='multi-select__tag'>
              {labelByValue.get(item) ?? item}
              <button
                type='button'
                className='multi-select__tag-remove'
                onClick={() => remove(item)}
                aria-label={t('actions.close')}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      }

      <Dropdown
        label={label}
        value={null}
        placeholder={placeholder}
        options={availableOptions}
        onChange={(next) => onChange([...value, next])}
        error={error}
        disabled={availableOptions.length === 0}
      />
    </div>
  )
}

export default MultiSelect
