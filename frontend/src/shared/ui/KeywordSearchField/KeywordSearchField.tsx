import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import './KeywordSearchField.scss'

function KeywordSearchField({ onSearch, placeholder, positionVertical = true }: {
  onSearch: (q: string) => void
  placeholder?: string
  positionVertical?: boolean
}) {
  const { t } = useTranslation('common')
  const [text, setText] = useState('')
  const label = placeholder ?? t('actions.search')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSearch(text.trim())
  }

  return (
    <div className='keyword-search' role='search'>
      <label htmlFor='keyword-search-input' className='keyword-search__label'>
        {label}
      </label>
      <div className={`keyword-search__container ${positionVertical ? 'vertical' : ''}`}>
        <div className='input-parchment-wrapper'>
          <input className='keyword-search__input'
            type='search'
            id='keyword-search-input'
            name='keyword-search'
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={t('actions.find')}
          />
        </div>
        <button className='keyword-search__button' type='button' onClick={submit}>
          {t('actions.find')}
        </button>
      </div>
    </div>
  )
}

export default KeywordSearchField
