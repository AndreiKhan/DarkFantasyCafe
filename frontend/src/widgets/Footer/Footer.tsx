import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import './Footer.scss'
import logo from '@/assets/images/logo5.webp'
import { ROUTES } from '@/shared/config/routes'

function Footer() {
  const { t } = useTranslation(['footer', 'common'])

  return (
    <footer className='footer'>
      <div className='footer__separator' aria-hidden='true' />
      <div className='footer__content'>
        <div className='center footer__grid'>
          <section className='footer__item' aria-label={t('common:a11y.siteLogo')}>
            <Link to={ROUTES.home}>
              <img className='footer__logo' src={logo} alt={t('common:a11y.siteLogo')} />
            </Link>
            {t('contacts.address')}
          </section>
          <nav className='footer__item' aria-label={t('links.title')}>
            <h5 className='footer__title' id='footer-links-title'>
              {t('links.title')}
            </h5>
            <Link to={ROUTES.home} className='footer__link'>
              {t('links.main')}
            </Link>
            <Link to={ROUTES.reserve} className='footer__link'>
              {t('links.booking')}
            </Link>
            <Link to={ROUTES.news} className='footer__link'>
              {t('links.news')}
            </Link>
            <Link to={ROUTES.characters} className='footer__link'>
              {t('links.gallery')}
            </Link>
          </nav>
          <section className='footer__item' aria-labelledby='footer-contacts-title'>
            <h5 className='footer__title' id='footer-contacts-title'>
              {t('contacts.title')}
            </h5>
            <a className='footer__text' href='tel:+78005553535'>
              8 800 555 35 35
            </a>
            <a className='footer__text' href='mailto:BaldGooseTavern@mail.ru'>
              BaldGooseTavern@mail.ru
            </a>
            {/* <ul className='footer__socials' aria-label={t('common:a11y.socialLinks')}>
              <li className='footer__social'>
                discord
              </li>
              <li className='footer__social'>
                telegram
              </li>
              <li className='footer__social'>
                vk
              </li>
            </ul> */}
          </section>
        </div>
      </div>
      <div className='footer__copyright'>
        <div className='center'>
          <p className='footer__copyright-text'>
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
