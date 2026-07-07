import { useEffect, useId, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import './Modal.scss'

type ModalProps = {
  title?: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

function Modal({ title, isOpen, onClose, children }: ModalProps) {
  const { t } = useTranslation('common')
  const titleId = useId()

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className='modal' onClick={onClose} role='presentation'>
      <div
        className='modal__content'
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? titleId : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        <div className='modal__header'>
          {title && (
            <p className='modal__title' id={titleId}>
              {title}
            </p>
          )}

          <button className='modal__close' type='button' onClick={onClose} aria-label={t('actions.close')}>
            <span aria-hidden='true'>X</span>
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal