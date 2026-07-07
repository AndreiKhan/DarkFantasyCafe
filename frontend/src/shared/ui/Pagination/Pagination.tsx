import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import './Pagination.scss'

function Pagination<T>({ items, pageSize, children, resetPage } : {
  items: T[]
  pageSize: number
  children: (pageItems: T[]) => ReactNode
  resetPage?: unknown
}) {
  const { t } = useTranslation('common')
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
        <nav className='pagination' aria-label={t('a11y.pagination')}>
          <button
            type='button'
            className='pagination__button'
            disabled={safePage === 1}
            aria-label={t('a11y.prevPage')}
            onClick={() => setPage(safePage - 1)}
          />

          {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type='button'
              className={pageNumber === safePage ? 'pagination__button pagination__button--active' : 'pagination__button'}
              aria-label={pageNumber === safePage ? t('a11y.currentPage', { page: pageNumber }) : t('a11y.page', { page: pageNumber })}
              aria-current={pageNumber === safePage ? 'page' : undefined}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type='button'
            className='pagination__button'
            disabled={safePage === pageCount}
            aria-label={t('a11y.nextPage')}
            onClick={() => setPage(safePage + 1)}
          />
        </nav>
      )}
    </>
  )
}

export default Pagination
