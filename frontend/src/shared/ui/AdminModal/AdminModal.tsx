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
              <button
                type='button'
                className='admin-modal__button admin-modal__button--danger'
                onClick={handleRemoveClick}
              >
                Удалить
              </button>
            )}
            <button
              type='button'
              className='admin-modal__button admin-modal__button--cancel'
              onClick={onClose}
            >
              Отменить
            </button>
            <button
              type='button'
              className='admin-modal__button admin-modal__button--save'
              onClick={onSave}
            >
              Сохранить
            </button>
          </div>
        </div>

        {confirmRemove && createPortal(
          <div
            className='admin-modal__confirm'
            onClick={(event) => {
              event.stopPropagation()
              setConfirmRemove(false)
            }}
          >
            <div
              className='admin-modal__confirm-content'
              onClick={(event) => event.stopPropagation()}
            >
              <p className='admin-modal__confirm-title'>
                Подтвердить удаление?
              </p>
              <div className='admin-modal__confirm-actions'>
                <button
                  type='button'
                  className='admin-modal__button admin-modal__button--cancel'
                  onClick={() => setConfirmRemove(false)}
                >
                  Нет
                </button>
                <button
                  type='button'
                  className='admin-modal__button admin-modal__button--danger'
                  onClick={confirmRemoveYes}
                >
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
