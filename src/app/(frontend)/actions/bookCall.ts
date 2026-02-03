'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { createBookCallFormSchema } from '@/components/BookCallForm/schema'
import { getTranslations } from 'next-intl/server'
import { headers } from 'next/headers'

type ServerActionResult = {
  success: boolean
  fieldErrors?: Record<string, string>
  formError?: string
  id?: string
}

// Simple in-memory rate limiter
// In production, consider using Redis or a dedicated rate limiting service
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 3 // Max 3 submissions per 10 minutes per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  // Clean up old entries periodically (simple garbage collection)
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key)
      }
    }
  }

  if (!record || record.resetTime < now) {
    // No record or window expired - create new window
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    })
    return true
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    // Rate limit exceeded
    return false
  }

  // Increment count
  record.count++
  return true
}

export async function submitBookCall(
  values: Record<string, unknown>,
  locale: string,
): Promise<ServerActionResult> {
  try {
    // Get IP address for rate limiting
    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0] ?? realIp ?? 'unknown'

    // Check rate limit
    if (!checkRateLimit(ip)) {
      const t = await getTranslations({ locale, namespace: 'bookCall' })
      return {
        success: false,
        formError: t('errors.rateLimitExceeded'),
      }
    }

    // Get translations for validation messages
    const t = await getTranslations({ locale, namespace: 'bookCall' })

    // Create schema with translated messages
    const schema = createBookCallFormSchema(t)

    // Validate input
    const result = schema.safeParse(values)

    if (!result.success) {
      // Build field errors from zod validation
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message
        }
      })

      return {
        success: false,
        fieldErrors,
      }
    }

    // Get Payload instance
    const payload = await getPayload({ config })

    // Create form submission
    // Using overrideAccess: true because this is a public form submission
    // (intentional admin-style operation for anonymous users)
    const submission = await payload.create({
      collection: 'form-submissions',
      data: {
        type: 'book-call',
        fullName: result.data.fullName,
        email: result.data.email.toLowerCase().trim(),
        companyName: result.data.companyName,
        phoneCountryCode: result.data.phoneCountryCode,
        phoneNumber: result.data.phoneNumber,
        preferredDate: result.data.preferredDate,
        privacyConsent: result.data.privacyConsent,
        status: 'new',
      },
      overrideAccess: true,
    })

    return {
      success: true,
      id: typeof submission.id === 'string' ? submission.id : String(submission.id),
    }
  } catch (error) {
    console.error('Failed to submit book call form:', error)

    // Get translations for error message
    const t = await getTranslations({ locale, namespace: 'bookCall' })

    return {
      success: false,
      formError: t('errors.generic'),
    }
  }
}
