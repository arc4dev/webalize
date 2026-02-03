'use client'

import { useState, useTransition } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createBookCallFormSchema } from './schema'
import { submitBookCall } from '@/app/(frontend)/actions/bookCall'

type BookCallFormProps = {
  onSuccess?: () => void
}

const COUNTRY_CODES_WITH_NAMES = [
  { code: '+1', country: 'US/CA' },
  { code: '+44', country: 'UK' },
  { code: '+48', country: 'PL' },
  { code: '+49', country: 'DE' },
  { code: '+33', country: 'FR' },
  { code: '+34', country: 'ES' },
  { code: '+39', country: 'IT' },
  { code: '+31', country: 'NL' },
  { code: '+46', country: 'SE' },
  { code: '+47', country: 'NO' },
  { code: '+45', country: 'DK' },
]

export function BookCallForm({ onSuccess }: BookCallFormProps) {
  const t = useTranslations('bookCall')
  const locale = useLocale()

  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const schema = createBookCallFormSchema(t)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      companyName: '',
      phoneCountryCode: '+48',
      phoneNumber: '',
      preferredDate: '',
      privacyConsent: false,
    },
  })

  const onSubmit = handleSubmit((values) => {
    setFormError(null)

    startTransition(async () => {
      const result = await submitBookCall(values, locale)

      if (result.success) {
        setSuccess(true)
        reset()

        if (onSuccess) {
          setTimeout(() => {
            onSuccess()
          }, 2000)
        }
      } else {
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof typeof values, { message })
          })
        }

        if (result.formError) {
          setFormError(result.formError)
        }
      }
    })
  })

  if (success) {
    return (
      <div>
        <p>{t('successMessage')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      {/* Full Name */}
      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="fullName"
          style={{ display: 'block', marginBottom: '0.5rem', color: 'black' }}
        >
          {t('fullName')} <span aria-label="required">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          {...register('fullName')}
          style={{ width: '100%', padding: '0.5rem' }}
        />
        {errors.fullName && (
          <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: 'black' }}>
          {t('email')} <span aria-label="required">*</span>
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          style={{ width: '100%', padding: '0.5rem' }}
        />
        {errors.email && (
          <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Company Name */}
      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="companyName"
          style={{ display: 'block', marginBottom: '0.5rem', color: 'black' }}
        >
          {t('companyName')}
        </label>
        <input
          type="text"
          id="companyName"
          {...register('companyName')}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      {/* Phone */}
      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="phoneNumber"
          style={{ display: 'block', marginBottom: '0.5rem', color: 'black' }}
        >
          {t('phone')}
        </label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            {...register('phoneCountryCode')}
            style={{ padding: '0.5rem', minWidth: '100px' }}
            aria-label={t('countryCode')}
          >
            {COUNTRY_CODES_WITH_NAMES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} {item.country}
              </option>
            ))}
          </select>
          <input
            type="tel"
            id="phoneNumber"
            {...register('phoneNumber')}
            placeholder={t('phonePlaceholder')}
            style={{ flex: 1, padding: '0.5rem' }}
          />
        </div>
      </div>

      {/* Preferred Date */}
      <div style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="preferredDate"
          style={{ display: 'block', marginBottom: '0.5rem', color: 'black' }}
        >
          {t('preferredDate')}
        </label>
        <input
          type="date"
          id="preferredDate"
          {...register('preferredDate')}
          min={new Date().toISOString().split('T')[0]}
          style={{ width: '100%', padding: '0.5rem' }}
        />
      </div>

      {/* Privacy Consent */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'black' }}>
          <input type="checkbox" {...register('privacyConsent')} />
          <span>
            {t('privacyConsent')} <span aria-label="required">*</span>
          </span>
        </label>
        {errors.privacyConsent && (
          <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {errors.privacyConsent.message}
          </p>
        )}
      </div>

      {/* Error message */}
      {formError && (
        <div style={{ marginBottom: '1rem', color: 'red' }}>
          <p>{formError}</p>
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isPending}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: isPending ? '#ccc' : '#000',
          color: 'white',
          border: 'none',
          cursor: isPending ? 'not-allowed' : 'pointer',
        }}
      >
        {isPending ? t('submitting') : t('submit')}
      </button>
    </form>
  )
}
