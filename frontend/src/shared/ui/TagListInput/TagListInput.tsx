import { useId, useState, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import './TagListInput.scss'

function TagListInput({ value, onChange, placeholder, label, maxItems, error }: {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  label?: string
  maxItems?: number
  error?: string
}) {
  const { t } = useTranslation('common')
  const errorId = useId()
  const [draft, setDraft] = useState('')

  const canAddMore = maxItems === undefined || value.length < maxItems

  const add = () => {
    const trimmed = draft.trim()
    if (!trimmed || !canAddMore) {
      return
    }
    onChange([...value, trimmed])
    setDraft('')
  }

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      add()
    }
  }

  return (
    <div className='tag-list-input'>
      {label &&
        <span className='tag-list-input__label'>
          {label}
        </span>
      }

      {value.length > 0 &&
        <ul className='tag-list-input__tags'>
          {value.map((item, index) => (
            <li key={`${item}-${index}`} className='tag-list-input__tag'>
              {item}
              <button
                type='button'
                className='tag-list-input__tag-remove'
                onClick={() => remove(index)}
                aria-label={t('actions.close')}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      }

      {canAddMore &&
        <div className='tag-list-input__add'>
          <div className='input-parchment-wrapper'>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
            />
          </div>
          <button type='button' className='tag-list-input__add-button' onClick={add} aria-label={t('actions.confirm')}>
            +
          </button>
        </div>
      }

      {error &&
        <span className='tag-list-input__error' id={errorId} role='alert'>
          {error}
        </span>
      }
    </div>
  )
}

export default TagListInput
