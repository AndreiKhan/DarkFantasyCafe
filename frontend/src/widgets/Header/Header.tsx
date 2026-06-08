import { useTranslation } from 'react-i18next'
import './Header.scss'

function Header() {
  const { t, i18n } = useTranslation()
  const toggleLanguage = () => {
    const next = i18n.language === 'ru' ? 'ru' : 'en'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme')
    const next = current === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }
  return (
    <header className='header'>
      <div className='center header__content'>
        <div className='header__logo'>
          logo
        </div>
        <div className='header__container'>
          <nav className='header__nav'>
            <ul className='header__nav-list'>
              <li className='header__nav-item header__nav-item--active'>
                <a href="#">
                  {t('header.nav.menu')}
                </a>
              </li>
              <li className='header__nav-item'>
                <a href="#">
                  {t('header.nav.booking')}
                </a>
              </li>
              <li className='header__nav-item'>
                <a href="#">
                  {t('header.nav.arena')}
                </a>
              </li>
              <li className='header__nav-item'>
                <a href="#">
                  {t('header.nav.gallery')}
                </a>
              </li>
              <li className='header__nav-item'>
                <a href="#">
                  {t('header.nav.news')}
                </a>
              </li>
            </ul>
          </nav>
          <div className='header__menu'>
            <button type='button' className='header__profile'>
              {t('header.profile')}
            </button>
            <button type='button' onClick={toggleLanguage}>
              {i18n.language === 'ru' ? 'RU' : 'EN'}
            </button>
            <button type='button' onClick={toggleTheme}>
              {i18n.language === 'dark' ? 'dark' : 'light'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
