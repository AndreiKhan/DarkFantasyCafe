import {
  useAdminContactRequests, useDeleteContactRequest, type ContactRequestFull,
} from '@/entities/ContactRequest'
import { AdminTable, ErrorPlug, Loader, Modal, type AdminTableColumn } from '@/shared/ui'
import { formatDateTime } from '@/shared/lib/datetime'
import { useState } from 'react'
import '@/shared/ui/AdminModal/AdminModal.scss'

const COLUMNS: AdminTableColumn<ContactRequestFull>[] = [
  { key: 'contact', header: 'Контакт', render: (item) => item.contact },
  { key: 'message', header: 'Сообщение', render: (item) => item.message },
  { key: 'createdAt', header: 'Создано', render: (item) => formatDateTime(item.createdAt) },
]

function ContactRequestAdminList() {
  const [query, setQuery] = useState('')
  const { data, isLoading, isError } = useAdminContactRequests(query)
  const del = useDeleteContactRequest()

  const [viewItem, setViewItem] = useState<ContactRequestFull | null>(null)

  const close = () => setViewItem(null)

  const removeCurrent = () => {
    if (viewItem) del.mutate(viewItem.id, { onSuccess: close })
  }

  if (isLoading) {
    return <Loader width='100px' height='100px' />
  }
  if (isError || !data) {
    return <ErrorPlug />
  }

  return (
    <div className='admin-entity'>
      <AdminTable
        columns={COLUMNS}
        data={data}
        getRowKey={(item) => item.id}
        onRowClick={setViewItem}
        onCreate={() => {}}
        createLabel='Создать'
        searchPlaceholder='Контакт, сообщение...'
        onSearch={setQuery}
      />

      <Modal title='Заявка' isOpen={Boolean(viewItem)} onClose={close}>
        {viewItem && (
          <div className='admin-form'>
            <p><strong>Контакт:</strong> {viewItem.contact}</p>
            <p><strong>Сообщение:</strong> {viewItem.message}</p>
            <p><strong>Создано:</strong> {formatDateTime(viewItem.createdAt)}</p>
            {del.error &&
              <p className='admin-modal__error'>{del.error.message}</p>
            }
            <button
              type='button'
              className='admin-modal__button admin-modal__button--danger'
              onClick={removeCurrent}
            >
              Удалить
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ContactRequestAdminList
