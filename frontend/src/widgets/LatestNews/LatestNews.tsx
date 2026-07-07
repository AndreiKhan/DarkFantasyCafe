import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useNewsList, type NewsCard, type NewsType } from '@/entities/News'
import { ErrorPlug, Loader } from '@/shared/ui'
import SectionDecoratedTitle from '@/shared/ui/SectionDecoratedTitle/SectionDecoratedTitle'
import './LatestNews.scss'

const NEWS_TYPES: NewsType[] = ['NEWS', 'PERFORMANCE', 'MONSTER']

function getLatestByType(items: NewsCard[]): NewsCard[] {
  return NEWS_TYPES
    .map((type) => items.find((item) => item.type === type))
    .filter((item): item is NewsCard => !!item)
    .sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''))
}

function LatestNews() {
  const { t, i18n } = useTranslation('news')
  const { data, isLoading, isError } = useNewsList()
  const items = getLatestByType(data ?? [])

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
    return (
      <section className='latest-news'>
        <div className='center'>
          <Loader width='120px' height='120px' />
        </div>
      </section>
    )
  }

  if (isError || items.length === 0) {
    return isError ? <ErrorPlug /> : null
  }

  return (
    <section className='latest-news'>
      <div className='center'>
        <SectionDecoratedTitle title={t('latestTitle')} />

        <ul className='latest-news__grid'>
          {items.map((item, index) => (
            <li
              key={item.slug}
              className={`latest-news__item${index === 0 ? ' latest-news__item--featured' : ''}`}
            >
              <Link className='latest-news__link' to={`/news/${item.slug}`}>
                {item.image &&
                  <div className='latest-news__image' style={{ backgroundImage: `url(${item.image})` }} />
                }
                <div className='latest-news__info'>
                  <span className='latest-news__type'>
                    {t(`types.${item.type}`)}
                  </span>
                  <h3 className='latest-news__title'>
                    {item.title}
                  </h3>
                  <p className='latest-news__description'>
                    {item.shortDescription}
                  </p>
                  <p className='latest-news__date'>
                    {formatDate(item.publishedAt)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default LatestNews
