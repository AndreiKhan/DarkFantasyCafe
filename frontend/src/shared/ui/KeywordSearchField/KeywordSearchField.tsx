import { useState, type FormEvent } from 'react'

function KeywordSearchField({ onSearch, placeholder = 'Поиск' }: {
  onSearch: (q: string) => void
  placeholder?: string
}) {
  const [text, setText] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSearch(text.trim())
  }

  return (
    <form onSubmit={submit} className="admin-search">
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
      />
      <button type="submit">Найти</button>
    </form>
  )
}

export default KeywordSearchField
