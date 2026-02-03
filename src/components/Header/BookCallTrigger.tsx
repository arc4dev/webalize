'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Modal } from '@/components/Modal'
import { BookCallForm } from '@/components/BookCallForm'

export function BookCallTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('bookCall')

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)

  const handleSuccess = () => {
    // Close modal after successful submission
    setTimeout(() => {
      handleClose()
    }, 2000)
  }

  return (
    <>
      <button onClick={handleOpen} type="button">
        {t('buttonLabel')}
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title={t('modalTitle')}>
        <BookCallForm onSuccess={handleSuccess} />
      </Modal>
    </>
  )
}
