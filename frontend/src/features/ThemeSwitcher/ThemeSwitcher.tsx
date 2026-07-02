import './ThemeSwitcher.scss'
import { useState } from 'react'

function ThemeSwitcher() {
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || 'light'
  )

  const toggleTheme = () => {
    const currentTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', currentTheme)
    localStorage.setItem('theme', currentTheme)
    setTheme(currentTheme)
  }
  return (
    <button className='theme-switcher' type='button' onClick={toggleTheme}>
      {theme === 'dark' ? 'dark' : 'light'}
    </button>
  )
}

export default ThemeSwitcher
