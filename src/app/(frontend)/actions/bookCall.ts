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

// In-memory rate limiter (production: Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 3

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key)
      }
    }
  }

  if (!record || record.resetTime < now) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    })
    return true
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false
  }

  record.count++
  return true
}

export async function submitBookCall(
  values: Record<string, unknown>,
  locale: string,
): Promise<ServerActionResult> {
  try {
    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0] ?? realIp ?? 'unknown'

    if (!checkRateLimit(ip)) {
      const t = await getTranslations({ locale, namespace: 'bookCall' })
      return {
        success: false,
        formError: t('errors.rateLimitExceeded'),
      }
    }

    const t = await getTranslations({ locale, namespace: 'bookCall' })
    const schema = createBookCallFormSchema(t)

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

    const payload = await getPayload({ config })

    // Public form: overrideAccess required for anonymous submissions
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
