import type React from 'react'
import type { Page, Post, Redirect } from '@/payload-types'

import { getCachedDocumentByID } from '@/utilities/getDocument'
import { getCachedRedirects } from '@/utilities/getRedirects'
import { notFound, redirect } from 'next/navigation'

interface Props {
  disableNotFound?: boolean
  url: string
}

type RedirectReference = NonNullable<NonNullable<Redirect['to']>['reference']>

const resolveReferenceUrl = (
  relationTo: RedirectReference['relationTo'],
  value: Page | Post | null | undefined,
): string | null => {

  if (!value || typeof value !== 'object' || !('slug' in value) || !value.slug) return null

  if ('url' in value && value.url) return value.url

  if (relationTo === 'posts' && 'category' in value) {
    return value.category ? `/${value.category}/${value.slug}` : null
  }

  return `/${value.slug}`
}

/* This component helps us with SSR based dynamic redirects */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await getCachedRedirects()()

  const redirectItem = redirects.find((redirect) => redirect.from === url)

  if (redirectItem) {
    if (redirectItem.to?.url) {
      redirect(redirectItem.to.url)
    }

    let redirectUrl: string | null = null

    if (typeof redirectItem.to?.reference?.value === 'number' && redirectItem.to?.reference?.relationTo) {
      const collection = redirectItem.to?.reference?.relationTo
      const id = redirectItem.to?.reference?.value

      if (collection === 'pages') {
        const document = (await getCachedDocumentByID(collection, id)()) as Page
        redirectUrl = resolveReferenceUrl(collection, document)
      } else {
        const document = (await getCachedDocumentByID(collection, id)()) as Post
        redirectUrl = resolveReferenceUrl(collection, document)
      }
    } else if (
      redirectItem.to?.reference?.relationTo === 'pages' &&
      typeof redirectItem.to.reference.value === 'object'
    ) {
      redirectUrl = resolveReferenceUrl('pages', redirectItem.to.reference.value)
    } else if (
      redirectItem.to?.reference?.relationTo === 'posts' &&
      typeof redirectItem.to.reference.value === 'object'
    ) {
      redirectUrl = resolveReferenceUrl('posts', redirectItem.to.reference.value)
    }

    if (redirectUrl) redirect(redirectUrl)
  }

  if (disableNotFound) return null

  notFound()
}
