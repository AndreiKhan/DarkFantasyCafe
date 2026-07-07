import './NewsPage.scss'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useNewsList } from '@/entities/News'
import { ErrorPlug, Loader, Pagination } from '@/shared/ui'
import SectionDecoratedTitle from '@/shared/ui/SectionDecoratedTitle/SectionDecoratedTitle'

function NewsPage() {
  const { t, i18n } = useTranslation(['news', 'common'])
  const { data, isLoading, isError } = useNewsList()

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
  if (isError) {
    return <ErrorPlug />
  }

  return (
    <section className='center news'>
      <SectionDecoratedTitle title={t('title')} />
      <Pagination items={data ?? []} pageSize={9}>
        {(pageItems) => (
          <ul className='news__list'>
            {pageItems.map((n) => (
              <li className='news__item' key={n.slug}>
                <Link className='news__link' to={`/news/${n.slug}`}>
                  <div className='news__image' style={{ backgroundImage: `url(${n.image})` }}/>
                  <div className='news__info'>
                    <h3 className='news__title'>
                      {n.title}
                    </h3>
                    <p className='news__description'>
                      {n.shortDescription}
                    </p>
                    <p className='news__date'>
                      {formatDate(n.publishedAt)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Pagination>
    </section>
  )
}

export default NewsPage
