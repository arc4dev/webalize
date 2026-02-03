import React from 'react'
import type { QuoteBannerBlock } from '@/payload-types'

export const QuoteBanner: React.FC<QuoteBannerBlock> = ({ quote, author }) => {
  if (!quote) return null

  return (
    <blockquote>
      {quote}
      {author && <cite>{author}</cite>}
    </blockquote>
  )
}
