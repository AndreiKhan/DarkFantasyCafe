import { useTranslation } from 'react-i18next'
import './Header.scss'
import { ThemeSwitcher } from '@/features/ThemeSwitcher'
import { LanguageSwitcher } from '@/features/LanguageSwitcher'
import { Link, NavLink } from 'react-router-dom'
import { useMe } from '@/entities/Auth'
import { ROUTES } from '@/shared/config/routes'
import logo from '@/assets/images/logo5.webp'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `header__nav-item${isActive ? ' header__nav-item--active' : ''}`

function Header() {
  const { t } = useTranslation(['header', 'common'])
  const { data } = useMe()
  const isAuth = Boolean(data?.user)

  return (
    <header className='header'>
      <div className='center header__content'>
        <Link className='header__logo-link' to={ROUTES.home} aria-label={t('common:a11y.siteLogo')}>
          <img className='header__logo' src={logo} alt={t('common:a11y.siteLogo')} />
        </Link>
        <div className='header__container'>
          <nav className='header__nav' aria-label={t('common:a11y.mainNav')}>
            <ul className='header__nav-list'>
              <li>
                <NavLink to={ROUTES.reserve} className={navLinkClass}>
                  {t('nav.booking')}
                </NavLink>
              </li>
              <li>
                <NavLink to={ROUTES.characters} className={navLinkClass}>
                  {t('nav.gallery')}
                </NavLink>
              </li>
              <li>
                <NavLink to={ROUTES.news} className={navLinkClass}>
                  {t('nav.news')}
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className='header__menu'>
            {isAuth ? (
              <Link
                to={ROUTES.profileUser(data!.user.sub)}
                className='header__menu-profile'
                aria-label={t('common:a11y.profile')}
              />
            ) : (
              <Link
                to={ROUTES.login}
                className='header__menu-profile'
                aria-label={t('common:a11y.login')}
              />
            )}
            <div className='header__menu-options' role='group' aria-label={t('common:a11y.interfaceOptions')}>
              <ThemeSwitcher />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
