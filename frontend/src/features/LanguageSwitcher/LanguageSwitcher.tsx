import './LanguageSwitcher.scss'
import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  // const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    const language = i18n.language === 'ru' ? 'en' : 'ru'
    i18n.changeLanguage(language)
    localStorage.setItem('lang', language)
  }

  return (
    <button className='language-switcher' type='button' onClick={toggleLanguage}>
      {i18n.language === 'ru' ? 'RU' : 'EN'}
      {/* {t('header.nav.booking')} */}
    </button>
  )
}

export default LanguageSwitcher
