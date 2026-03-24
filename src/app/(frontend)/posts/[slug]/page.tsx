import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { cache } from 'react'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})

export default async function Post({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) {
    return redirect('/404')
  }

  // Redirect to category-based URL
  if (post.category && post.slug) {
    return redirect(`/${post.category}/${post.slug}`)
  }

  // Fallback redirect
  return redirect('/')
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  return {
    title: 'Redirecting...',
    robots: {
      index: false,
      follow: false,
    },
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}
