import './ThemeSwitcher.scss'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SunIcon from '@/assets/svg/sun.svg?react'
import MoonIcon from '@/assets/svg/moon.svg?react'

function ThemeSwitcher() {
  const { t } = useTranslation('common')
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'light')

  const toggleTheme = () => {
    const currentTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', currentTheme)
    localStorage.setItem('theme', currentTheme)
    setTheme(currentTheme)
  }
  const themeLabel = theme === 'dark' ? t('theme.dark') : t('theme.light')
  const ThemeIcon = theme === 'dark' ? MoonIcon : SunIcon

  return (
    <button
      className='theme-switcher'
      type='button'
      onClick={toggleTheme}
      aria-label={`${t('a11y.themeToggle')}: ${themeLabel}`}
    >
      <span className='theme-switcher__icon' aria-hidden='true'>
        <ThemeIcon />
      </span>
    </button>
  )
}

export default ThemeSwitcher
