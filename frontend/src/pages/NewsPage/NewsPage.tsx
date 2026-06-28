import { Link } from 'react-router-dom'
import { useNewsList } from '@/entities/News'
import { Pagination } from '@/shared/ui'

function NewsPage() {
  const { data, isLoading, isError } = useNewsList()

  if (isLoading) {
    return <p>isLoading</p>
  }
  if (isError) {
    return <p>isError</p>
  }

  return (
    <section className="center">
      <h1>News</h1>
      <Pagination items={data ?? []} pageSize={10}>
        {(pageItems) => (
          <ul>
            {pageItems.map((n) => (
              <li key={n.slug}>
                <Link to={`/news/${n.slug}`}>
                  {n.image && <img src={n.image} alt={n.title} width={120} />}
                  <h3>{n.title}</h3>
                  <p>{n.shortDescription}</p>
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