import { z } from 'zod'

export const COUNTRY_CODES = [
  '+1',
  '+44',
  '+48',
  '+49',
  '+33',
  '+34',
  '+39',
  '+31',
  '+46',
  '+47',
  '+45',
] as const

export const createBookCallFormSchema = (t: (key: string) => string) =>
  z.object({
    fullName: z.string().min(1, t('errors.fullNameRequired')),
    email: z.string().email(t('errors.emailInvalid')),
    companyName: z.string().trim().optional(),
    phoneCountryCode: z.string().trim().optional(),
    phoneNumber: z.string().trim().optional(),
    preferredDate: z.string().optional(),
    privacyConsent: z.boolean().refine((val) => val === true, {
      message: t('errors.privacyRequired'),
    }),
  })

export type BookCallFormValues = z.infer<ReturnType<typeof createBookCallFormSchema>>
