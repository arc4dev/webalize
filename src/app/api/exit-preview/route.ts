import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Exit preview mode route handler
 *
 * Usage:
 * /api/exit-preview?redirect=/pl/news/some-slug
 *
 * This disables Next.js draft mode and redirects to the specified URL.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const redirectTo = searchParams.get('redirect') || '/'

  // Disable draft mode
  const draft = await draftMode()
  draft.disable()

  // Redirect to the specified URL or home
  redirect(redirectTo)
}

/**
 * POST handler for client-side exit (from banner button)
 */
export async function POST() {
  const draft = await draftMode()
  draft.disable()

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
