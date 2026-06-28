import { useParams } from 'react-router-dom'
import { useNews } from '@/entities/News'
import { HtmlContent } from '@/shared/ui'

function NewsSlugPage() {
  const { slug = '' } = useParams()
  const { data, isLoading, isError } = useNews(slug)

  if (isLoading) {
    return <p>isLoading</p>
  }
  if (isError || !data) {
    return <p>isError</p>
  }

  return (
    <article className="center">
      <h1>{data.title}</h1>

      {data.images[0] &&
        <img src={data.images[0]} alt={data.title} />
      }

      <HtmlContent markdown={data.body} />
    </article>
  )
}

export default NewsSlugPage