import type { ArticleStackGridBlock as ArticleStackGridBlockProps } from 'src/payload-types'

import React from 'react'

type Props = {
  className?: string
} & ArticleStackGridBlockProps

export const ArticleStackGridBlock: React.FC<Props> = ({ className, items }) => {
  return (
    <div className={`stack-grid ${className || ''}`}>
      {items?.map((item, index) => (
        <div key={index} className="stack-item">
          {item.label && (
            <div className="stack-item-label">
              {item.label}
            </div>
          )}
          {item.name && (
            <div className="stack-item-name">
              {item.name}
            </div>
          )}
          {item.description && (
            <div className="stack-item-desc">
              {item.description}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
