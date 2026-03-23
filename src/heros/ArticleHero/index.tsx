import { formatDateTime } from '@/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'

export const ArticleHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { category, heroImage, populatedAuthors, publishedAt, readingTime, subtitle, title, eyebrow } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  const displayEyebrow = eyebrow || (category ? category.toUpperCase() : '')

  return (
    <div className="hero">
      {displayEyebrow && (
        <div className="hero-eyebrow">
          {displayEyebrow}
        </div>
      )}

      <h1>
        {title}
      </h1>

      {subtitle && (
        <p className="hero-deck">
          {subtitle}
        </p>
      )}

      <div className="byline">
        {hasAuthors && <span>{formatAuthors(populatedAuthors)} &nbsp;·&nbsp; </span>}
        {publishedAt && <span>{formatDateTime(publishedAt)}</span>}
        {readingTime && <span> &nbsp;·&nbsp; {readingTime} min read</span>}
      </div>
    </div>
  )
}
