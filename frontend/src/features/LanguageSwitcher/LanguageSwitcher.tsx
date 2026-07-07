import './LanguageSwitcher.scss'
import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { t, i18n } = useTranslation('common')
  const currentLanguage = i18n.language === 'ru' ? 'RU' : 'EN'

  const toggleLanguage = () => {
    const language = i18n.language === 'ru' ? 'en' : 'ru'
    i18n.changeLanguage(language)
    localStorage.setItem('lang', language)
  }

  return (
    <button
      className='language-switcher'
      type='button'
      onClick={toggleLanguage}
      aria-label={`${t('a11y.languageToggle')}: ${currentLanguage}`}
    >
      {currentLanguage}
    </button>
  )
}

export default LanguageSwitcher
