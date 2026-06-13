import { useTranslation } from 'react-i18next'
import './Header.scss'
import { ThemeSwitcher } from '@/features/ThemeSwitcher'
import { LanguageSwitcher } from '@/features/LanguageSwitcher'

function Header() {
  const { t } = useTranslation('header')
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
                  {t('nav.menu')}
                </a>
              </li>
              <li className='header__nav-item'>
                <a href="#">
                  {t('nav.booking')}
                </a>
              </li>
              <li className='header__nav-item'>
                <a href="#">
                  {t('nav.arena')}
                </a>
              </li>
              <li className='header__nav-item'>
                <a href="#">
                  {t('nav.gallery')}
                </a>
              </li>
              <li className='header__nav-item'>
                <a href="#">
                  {t('nav.news')}
                </a>
              </li>
            </ul>
          </nav>
          <div className='header__menu'>
            <button type='button' className='header__profile'>
              {t('profile')}
            </button>
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
