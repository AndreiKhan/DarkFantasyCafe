import type { ReactNode } from 'react'
import KeywordSearchField from '../KeywordSearchField/KeywordSearchField'
import './AdminTable.scss'

export type AdminTableColumn<T> = {
  key: string
  header: string
  render: (item: T) => ReactNode
}

function AdminTable<T>({
  columns,
  data,
  getRowKey,
  onRowClick,
  onCreate,
  createLabel,
  searchPlaceholder,
  onSearch,
  emptyMessage = 'Ничего не найдено',
}: {
  columns: AdminTableColumn<T>[]
  data: T[]
  getRowKey: (item: T) => string
  onRowClick: (item: T) => void
  onCreate: () => void
  createLabel: string
  searchPlaceholder: string
  onSearch: (query: string) => void
  emptyMessage?: string
}) {
  return (
    <div className='admin-table'>
      <div className='admin-table__toolbar'>
        <button type='button' className='admin-table__create' onClick={onCreate}>
          {createLabel}
        </button>
        <div className='admin-table__search'>
          <KeywordSearchField onSearch={onSearch} placeholder={searchPlaceholder} positionVertical={false} />
        </div>
      </div>

      <div className='admin-table__wrapper'>
        <table className='admin-table__table'>
          <thead className='admin-table__head'>
            <tr className='admin-table__row admin-table__row--head'>
              {columns.map((column) => (
                <th key={column.key} className='admin-table__cell admin-table__cell--head'>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='admin-table__body'>
            {data.map((item) => (
              <tr
                key={getRowKey(item)}
                className='admin-table__row admin-table__row--body'
                onClick={() => onRowClick(item)}
              >
                {columns.map((column) => (
                  <td key={column.key} className='admin-table__cell'>
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}

            {data.length === 0 && (
              <tr className='admin-table__row admin-table__row--empty'>
                <td className='admin-table__cell admin-table__cell--empty' colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminTable
