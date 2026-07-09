import './NewsSlugPage.scss'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useNews, type NewsType } from '@/entities/News'
import { useMe } from '@/entities/Auth'
import { useTrackAchievement } from '@/entities/Achievement'
import { ErrorPlug, HtmlContent, Loader, Modal } from '@/shared/ui'
import { ROUTES } from '@/shared/config/routes'

function NewsSlugPage() {
  const { slug = '' } = useParams()
  const { t, i18n } = useTranslation(['news', 'common'])
  const { data, isLoading, isError } = useNews(slug)
  const { data: me } = useMe()
  const trackAchievement = useTrackAchievement()
  const tracked = useRef(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  useEffect(() => {
    if (!data || !me || tracked.current) {
      return
    }
    tracked.current = true
    trackAchievement.mutate('first_news_read')
  }, [data, me])

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
            <button
              type='button'
              className='article__gallery-frame'
              key={image}
              onClick={() => setLightboxImage(image)}
              aria-label={t('gallery.openImage', { index: index + 1 })}
            >
              <img className='article__gallery-image' src={image} alt={`${data.title} ${index + 2}`} />
            </button>
          ))}
        </div>
      }

      <Modal isOpen={lightboxImage !== null} onClose={() => setLightboxImage(null)}>
        {lightboxImage &&
          <img
            className='article__lightbox'
            src={lightboxImage}
            alt={data.title}
          />
        }
      </Modal>
    </article>
  )
}

export default NewsSlugPage