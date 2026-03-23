import type { ArticleCalloutBlock as ArticleCalloutBlockProps } from 'src/payload-types'

import React from 'react'

type Props = {
  className?: string
} & ArticleCalloutBlockProps

export const ArticleCalloutBlock: React.FC<Props> = ({ className, quote, cite }) => {
  return (
    <div className={`callout ${className || ''}`}>
      <div>
        {quote && (
          <p>
            {quote}
          </p>
        )}
        {cite && (
          <cite>
            {cite}
          </cite>
        )}
      </div>
    </div>
  )
}
