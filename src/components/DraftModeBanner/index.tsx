'use client'

import { useRouter } from 'next/navigation'

export function DraftModeBanner() {
  const router = useRouter()

  const exitPreview = async () => {
    await fetch('/api/exit-preview')
    router.refresh()
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f59e0b',
        color: 'white',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 9999,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '20px' }}>👁️</span>
        <span style={{ fontWeight: 600 }}>Preview Mode Active</span>
        <span style={{ opacity: 0.9 }}>You are viewing draft content</span>
      </div>
      <button
        onClick={exitPreview}
        style={{
          backgroundColor: 'white',
          color: '#f59e0b',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        Exit Preview
      </button>
    </div>
  )
}
