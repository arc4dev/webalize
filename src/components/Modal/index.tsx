'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  fullScreen?: boolean
}

export function Modal({ isOpen, onClose, title, children, fullScreen = false }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle click outside to close
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  // Render modal using portal to body
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        ref={modalRef}
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          ...(fullScreen
            ? {
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
              }
            : {
                maxWidth: '500px',
                width: '90%',
                maxHeight: '90vh',
              }),
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          type="button"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            border: 'none',
            background: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
          }}
        >
          ×
        </button>

        {/* Title */}
        {title && (
          <h2 id="modal-title" style={{ marginBottom: '1.5rem' }}>
            {title}
          </h2>
        )}

        {/* Modal content */}
        {children}
      </div>
    </div>,
    document.body,
  )
}
