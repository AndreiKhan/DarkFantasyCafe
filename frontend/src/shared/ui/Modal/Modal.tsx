import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import './Modal.scss'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

function Modal({ isOpen, onClose, children }: ModalProps) {
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
    <div className="modal" onClick={onClose}>
      <div className="modal__content" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal