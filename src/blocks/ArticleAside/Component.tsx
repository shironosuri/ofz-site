import type { ArticleAsideBlock as ArticleAsideBlockProps } from 'src/payload-types'

import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & ArticleAsideBlockProps

export const ArticleAsideBlock: React.FC<Props> = ({ className, content, style }) => {
  const getIcon = () => {
    switch (style) {
      case 'warning':
        return '⚠️'
      case 'tip':
        return '💡'
      case 'note':
      default:
        return '↳'
    }
  }

  return (
    <div className={`aside ${className || ''}`}>
      <div className="aside-icon">
        {getIcon()}
      </div>
      <div className="aside-content">
        <RichText data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}
