'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

type IntegrationSearchProps = {
  categorySlug?: string
}

export function IntegrationSearch({ categorySlug }: IntegrationSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations('integrations')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const search = formData.get('search') as string

    const params = new URLSearchParams()
    if (categorySlug && categorySlug !== 'all') {
      params.set('category', categorySlug)
    }
    if (search && search.trim() !== '') {
      params.set('search', search.trim())
    }

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <form onSubmit={handleSubmit}>
      {categorySlug && categorySlug !== 'all' && (
        <input type="hidden" name="category" value={categorySlug} />
      )}
      <label htmlFor="search">{t('search.label')}</label>
      <input
        type="search"
        id="search"
        name="search"
        defaultValue={searchParams.get('search') || ''}
        placeholder={t('search.placeholder')}
      />
      <button type="submit">{t('search.button')}</button>
    </form>
  )
}
