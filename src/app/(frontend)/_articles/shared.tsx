import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { ContentRegisterLayout } from '@/components/ContentRegister/Layout'
import { ArticleHero } from '@/heros/ArticleHero'
import { Card } from '@/components/Card'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'

export async function generateArticleStaticParams(category: string) {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    where: {
      category: {
        equals: category,
      },
    },
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type ArticleDetailArgs = {
  params: Promise<{
    slug?: string
  }>
  category: string
}

export async function articleDetailPage({ params: paramsPromise, category }: ArticleDetailArgs) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = `/${category}/${decodedSlug}`
  const post = await queryPostBySlugAndCategory({ slug: decodedSlug, category })

  if (!post) return notFound()

  return (
    <article className="pt-16 pb-16">
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <ContentRegisterLayout>
        <ArticleHero post={post} />

        <div className="flex flex-col items-center gap-4 pt-8">
          <div className="container">
            <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
            {post.relatedPosts && post.relatedPosts.length > 0 && (
              <RelatedPosts
                className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
                docs={post.relatedPosts.filter((post) => typeof post === 'object')}
              />
            )}
          </div>
        </div>
      </ContentRegisterLayout>
    </article>
  )
}

export async function generateArticleMetadata({ params: paramsPromise, category }: ArticleDetailArgs): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlugAndCategory({ slug: decodedSlug, category })

  return generateMeta({ doc: post })
}

const queryPostBySlugAndCategory = cache(async ({ slug, category }: { slug: string; category: string }) => {
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
      category: {
        equals: category,
      },
    },
  })

  return result.docs?.[0] || null
})

export async function articleListingPage({ category }: { category: string }) {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    where: {
      category: {
        equals: category,
      },
    },
    select: {
      title: true,
      slug: true,
      category: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>{category}</h1>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {posts.docs.map((post, index) => (
            <div className="col-span-4" key={index}>
              <Card doc={post} relationTo="posts" showCategories />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function generateListingMetadata(category: string): Metadata {
  return {
    title: `${category} Articles`,
    description: `Browse all ${category} articles`,
  }
}
