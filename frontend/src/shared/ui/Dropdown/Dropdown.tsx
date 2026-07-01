import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string }

function Dropdown({ options, value, onChange, placeholder, label, error, disabled }: {
  options: Option[]
  value: string | null
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
}) {
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
    <div className="dropdown" ref={rootRef}>
      {label &&
        <span className="dropdown__label">
          {label}
        </span>
      }

      <button type="button" className="dropdown__head" disabled={disabled} onClick={() => setOpen((value) => !value)}>
        {selected?.label ?? placeholder ?? 'выбрать'}
      </button>

      {open && 
        <ul className="dropdown__list" role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              className={`dropdown__option ${option.value === value ? 'dropdown__option--active' : ''}`}
              onClick={() => { onChange(option.value); setOpen(false) }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      }

      {error &&
        <span className="dropdown__error">
          {error}
        </span>
      }
    </div>
  )
}

export default Dropdown