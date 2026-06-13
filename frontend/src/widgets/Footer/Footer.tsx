import { useTranslation } from 'react-i18next'
import './Footer.scss'

function Footer() {
  const { t } = useTranslation('footer')
  
  return (
    <footer className='footer'>
      <div className='footer__separator' />
      <div className='footer__content'>
        <div className='center footer__grid'>
          <section className='footer__item'>
            LOGO<b className='footer__logo'/>
            SOME LOGO TEXT<b className='footer__logo-title'/>
            address<b className='footer__subtext'/>
          </section>
          <section className='footer__item'>
            <h5 className='footer__title'>
              {t('links.title')}
            </h5>
            <a href="#" className='footer__link'>
              {t('links.menu')}
            </a>
            <a href="#" className='footer__link'>
              {t('links.booking')}
            </a>
            <a href="#" className='footer__link'>
              {t('links.arena')}
            </a>
            <a href="#" className='footer__link'>
              {t('links.gallery')}
            </a>
            <a href="#" className='footer__link'>
              {t('links.faq')}
            </a>
          </section>
          <section className='footer__item'>
            <h5 className='footer__title'>
              {t('contacts.title')}
            </h5>
            <a href="#" className='footer__text'>
              {t('contacts.phone')}
            </a>
            <a href="#" className='footer__text'>
              {t('contacts.email')}
            </a>
            <div className='footer__socials'>
              <div className='footer__social'>
                social
              </div>
              <div className='footer__social'>
                social
              </div>
              <div className='footer__social'>
                social
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className='footer__copyright'>
        <div className='center'>
          <p className='footer__copyright-text'>
            @ 2026 The Bald Goose. All adventures reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
