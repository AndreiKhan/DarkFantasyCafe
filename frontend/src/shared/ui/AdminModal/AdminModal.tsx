import Modal from '../Modal/Modal'
import './AdminModal.scss'
import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type AdminModalProps = {
  title: string
  isOpen: boolean
  onClose: () => void
  onRemove?: () => void
  onSave: () => void
  error?: string
  children: ReactNode
}

function AdminModal({ title, isOpen, onClose, onRemove, onSave, error, children }: AdminModalProps) {
  const [confirmRemove, setConfirmRemove] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setConfirmRemove(false)
    }
  }, [isOpen])

  const handleRemoveClick = () => setConfirmRemove(true)

  const confirmRemoveYes = () => {
    setConfirmRemove(false)
    onRemove?.()
  }

  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={onClose}
    >
        <div className='admin-modal'>
          <div className='admin-modal__content'>
            {children}
          </div>
          {error && (
            <div className='admin-modal__error'>
              {error}
            </div>
          )}
          <div className='admin-modal__footer'>
            {onRemove && (
              <button type='button' onClick={handleRemoveClick}>
                Удалить
              </button>
            )}
            <button type='button' onClick={onClose}>
              Отменить
            </button>
            <button type='button' onClick={onSave}>
              Сохранить
            </button>
          </div>
        </div>

        {confirmRemove && createPortal(
          <div
            className='modal'
            onClick={(event) => {
              event.stopPropagation()
              setConfirmRemove(false)
            }}
          >
            <div
              className='modal__content'
              onClick={(event) => event.stopPropagation()}
            >
              <div className='modal__header'>
                <p className='modal__title'>
                  Подтвердить?
                </p>
              </div>
              <div className='admin-modal__footer'>
                <button type='button' onClick={() => setConfirmRemove(false)}>
                  Нет
                </button>
                <button type='button' onClick={confirmRemoveYes}>
                  Да
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </Modal>
  )
}

export default AdminModal
