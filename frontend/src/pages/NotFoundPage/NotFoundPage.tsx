import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/shared/config/routes'
import './NotFoundPage.scss'

function NotFoundPage() {
  const { t } = useTranslation('notFound')

  return (
    <section className='not-found'>
      <div className='center not-found__content'>
        <h1 className='not-found__code'>
          404
        </h1>
        <Link className='not-found__home' to={ROUTES.home}>
          {t('home')}
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
