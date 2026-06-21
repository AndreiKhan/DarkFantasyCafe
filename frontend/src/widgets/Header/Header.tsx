import { useTranslation } from 'react-i18next'
import './Header.scss'
import { ThemeSwitcher } from '@/features/ThemeSwitcher'
import { LanguageSwitcher } from '@/features/LanguageSwitcher'
import { Link } from 'react-router-dom'
import { useMe, useLogout } from '@/features/auth'


function Header() {
  const { t } = useTranslation('header')
  const logout = useLogout()
  const { data } = useMe()
  const isAuth = Boolean(data?.user)
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
            {isAuth ? (
              <button type='button' className='header__profile' onClick={() => logout.mutate()}>
                Выйти
              </button>
            ) : (
              <Link to='/login' className='header__profile'>
                Войти
              </Link>
            )}
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
