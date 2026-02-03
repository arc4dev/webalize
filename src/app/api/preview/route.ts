import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Preview mode route handler
 *
 * Usage:
 * /api/preview?secret=YOUR_SECRET&slug=news-slug&locale=pl&collection=news
 *
 * This enables Next.js draft mode and redirects to the preview URL.
 * The preview secret should be stored in environment variables.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')
  const locale = searchParams.get('locale') || 'pl'
  const collection = searchParams.get('collection') || 'news'

  // Check secret (should match PAYLOAD_PREVIEW_SECRET env var)
  const previewSecret =
    process.env.PAYLOAD_PREVIEW_SECRET || 'my-preview-secret-change-in-production'

  if (!secret || secret !== previewSecret) {
    return new Response('Invalid token', { status: 401 })
  }

  // Check slug is provided
  if (!slug) {
    return new Response('Missing slug parameter', { status: 400 })
  }

  // Verify the document exists
  const payload = await getPayload({ config })

  try {
    const { docs } = await payload.find({
      collection: collection as 'news' | 'faq',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      draft: true,
      overrideAccess: true, // Admin operation for preview
    })

    if (!docs || docs.length === 0) {
      return new Response('Document not found', { status: 404 })
    }
  } catch (error) {
    console.error('Preview error:', error)
    return new Response('Error fetching document', { status: 500 })
  }

  // Enable draft mode
  const draft = await draftMode()
  draft.enable()

  // Build preview URL based on collection
  let previewUrl = `/${locale}`

  if (collection === 'news') {
    previewUrl += `/news/${slug}`
  } else if (collection === 'faq') {
    previewUrl += `/faq`
  } else {
    previewUrl += `/${slug}`
  }

  // Redirect to the preview URL
  redirect(previewUrl)
}
