import { useTranslation } from 'react-i18next'
import './Hero.scss'
import { NavLink } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'

function Hero() {
  const { t } = useTranslation('hero')

  return (
    <section className='hero'>
      <div className='center'>
        <div className='hero__description'>
          <h1 className='hero__title'>
            {t('title')}
          </h1>
          <h3 className='hero__subtitle'>
            {t('subtitle')}
          </h3>
          <NavLink to={ROUTES.reserve} className='hero__main-button'>
            {t('bookTable')}
          </NavLink>
        </div>
      </div>
    </section>
  )
}

export default Hero
