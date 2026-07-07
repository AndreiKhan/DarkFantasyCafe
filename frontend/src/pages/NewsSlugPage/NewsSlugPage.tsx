import './NewsSlugPage.scss'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useNews, type NewsType } from '@/entities/News'
import { ErrorPlug, HtmlContent, Loader } from '@/shared/ui'
import { ROUTES } from '@/shared/config/routes'

function NewsSlugPage() {
  const { slug = '' } = useParams()
  const { t, i18n } = useTranslation(['news', 'common'])
  const { data, isLoading, isError } = useNews(slug)

  function formatDate(date: string | null) {
    if (!date) {
      return ''
    }

    return new Date(date).toLocaleDateString(i18n.language === 'ru' ? 'ru-RU' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  if (isLoading) {
    return <Loader width='200px' height='200px' />
  }
  if (isError || !data) {
    return <ErrorPlug />
  }

  const [cover, ...gallery] = data.images

  return (
    <article className='center article'>
      <Link className='article__back' to={ROUTES.news}>
        {t('backToNews')}
      </Link>

      <header className='article__header'>
        <span className='article__badge'>
          {t(`types.${data.type as NewsType}`, { defaultValue: data.type })}
        </span>
        <h1 className='article__title'>
          {data.title}
        </h1>
        {data.publishedAt &&
          <p className='article__date'>
            {formatDate(data.publishedAt)}
          </p>
        }
      </header>

      {cover &&
        <div className='article__image-frame'>
          <img className='article__image' src={cover} alt={data.title} />
        </div>
      }

      <div className='article__divider' />

      <div className='article__description'>
        <HtmlContent markdown={data.body} />
      </div>

      {gallery.length > 0 &&
        <div className='article__gallery'>
          {gallery.map((image, index) => (
            <div className='article__gallery-frame' key={image}>
              <img className='article__gallery-image' src={image} alt={`${data.title} ${index + 2}`} />
            </div>
          ))}
        </div>
      }
    </article>
  )
}

export default NewsSlugPage