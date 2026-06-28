import { useEffect, useState, type ReactNode } from 'react'

function Pagination<T>({ items, pageSize, children, resetPage } : {
  items: T[]
  pageSize: number
  children: (pageItems: T[]) => ReactNode
  resetPage?: unknown
}) {

  const [page, setPage] = useState(1)
  const pageCount = Math.ceil(items.length / pageSize)

  useEffect(() => {
    setPage(1)
  }, [resetPage])

  useEffect(() => {
    if (page > pageCount && pageCount > 0) {
      setPage(1)
    }
  }, [page, pageCount])

  const safePage = Math.min(page, Math.max(pageCount, 1))
  const start = (safePage - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)

  return (
    <>
      {children(pageItems)}

      {pageCount > 1 && (
        <nav className="pagination">
          <button disabled={safePage === 1} onClick={() => setPage(safePage - 1)}>
            -
          </button>

          {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={page === safePage ? 'pagination__btn pagination__btn--active' : 'pagination__btn'}
              onClick={() => setPage(page)}
            >
              {page}
            </button>
          ))}

          <button disabled={safePage === pageCount} onClick={() => setPage(safePage + 1)}>
            +
          </button>
        </nav>
      )}
    </>
  )
}

export default Pagination