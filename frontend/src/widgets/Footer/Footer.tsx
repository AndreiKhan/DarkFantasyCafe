import './Footer.scss'

function Footer() {
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
              Quick links
            </h5>
            <a href="#" className='footer__link'>
              Menu
            </a>
            <a href="#" className='footer__link'>
              Reserve
            </a>
            <a href="#" className='footer__link'>
              Heroes
            </a>
            <a href="#" className='footer__link'>
              Arena
            </a>
            <a href="#" className='footer__link'>
              Gallery
            </a>
            <a href="#" className='footer__link'>
              FAQ
            </a>
          </section>
          <section className='footer__item'>
            <h5 className='footer__title'>
              Contacts
            </h5>
            <a href="#" className='footer__text'>
              phone
            </a>
            <a href="#" className='footer__text'>
              email
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
