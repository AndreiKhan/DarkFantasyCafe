import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useNewsList } from '@/entities/News'

function formatTime(iso: string): string {
  const date = new Date(iso)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export function TodayPerformance({ date }: { date: string }) {
  const { t } = useTranslation('reservation')
  const { data: performanceData } = useNewsList('PERFORMANCE')
  const { data: newsData } = useNewsList('NEWS')

  const performances = (performanceData ?? [])
    .filter((item) => item.startsAt?.slice(0, 10) === date)
    .sort((a, b) => (a.startsAt ?? '').localeCompare(b.startsAt ?? ''))

  const news = (newsData ?? []).filter((item) => item.startsAt?.slice(0, 10) === date)

  const items = [...performances, ...news]

  return (
    <div className='reserve__performance'>
      <h5 className='reserve__performance-label'>
        {t('performance.label')}
      </h5>

      {items.length > 0 ? (
        <div className='reserve__performance-list'>
          {items.map((item) => (
            <Link key={item.slug} className='reserve__performance-card' to={`/news/${item.slug}`}>
              {item.image &&
                <div className='reserve__performance-image' style={{ backgroundImage: `url(${item.image})` }} />
              }
              <div className='reserve__performance-info'>
                <p className='reserve__performance-title'>
                  {item.title}
                </p>
                {item.type === 'PERFORMANCE' && item.startsAt &&
                  <p className='reserve__performance-time'>
                    {t('performance.at', { time: formatTime(item.startsAt) })}
                  </p>
                }
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className='reserve__performance-empty'>
          {t('performance.none')}
        </p>
      )}
    </div>
  )
}
