import { useTranslation } from 'react-i18next'
import './Hero.scss'

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
          <button className='hero__main-button' type='button'>
            {t('bookTable')}
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
