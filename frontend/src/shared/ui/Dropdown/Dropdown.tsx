import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './Dropdown.scss'

type Option = { value: string; label: string; disabled?: boolean }

function Dropdown({ options, value, onChange, placeholder, label, error, disabled }: {
  options: Option[]
  value: string | null
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
}) {
  const { t } = useTranslation('common')
  const labelId = useId()
  const errorId = useId()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const selected = options.find((object) => object.value === value)

  return (
    <div className='dropdown' ref={rootRef}>
      {label &&
        <p className='dropdown__label' id={labelId}>
          {label}
        </p>
      }

      <div className='dropdown__wrapper'>
        <button
          type='button'
          className='dropdown__head'
          disabled={disabled}
          aria-expanded={open}
          aria-haspopup='listbox'
          aria-labelledby={label ? labelId : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onClick={() => setOpen((value) => !value)}
        >
          {selected?.label ?? placeholder ?? t('actions.select')}
        </button>

        {open && 
          <ul className='dropdown__list' role='listbox' aria-labelledby={label ? labelId : undefined}>
            {options.map((option) => (
              <li
                key={option.value}
                role='option'
                aria-selected={option.value === value}
                className={`dropdown__option ${option.value === value ? 'dropdown__option--active' : ''} ${option.disabled ? 'dropdown__option--disabled' : ''}`}
                aria-disabled={option.disabled}
                onClick={() => { if (!option.disabled) { onChange(option.value); setOpen(false) } }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        }
      </div>

      {error &&
        <span className='dropdown__error' id={errorId} role='alert'>
          {error}
        </span>
      }
    </div>
  )
}

export default Dropdown