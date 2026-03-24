import React, { Fragment } from 'react'
import type { DividerBlock, RichTextSection, StepSection } from '@/payload-types'
import { DividerBlockComponent } from './ArticleBlocks/DividerBlock/Component'
import { RichTextSectionComponent } from './ArticleBlocks/RichTextSection/Component'
import { StepSectionComponent } from './ArticleBlocks/StepSection/Component'

type ArticleBlock = RichTextSection | StepSection | DividerBlock

export const RenderArticleBlocks: React.FC<{
  blocks: ArticleBlock[]
  className?: string
}> = (props) => {
  const { blocks, className = '' } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType === 'richTextSection') {
            return (
              <div className="my-16" key={index}>
                <RichTextSectionComponent block={block as RichTextSection} className={className} />
              </div>
            )
          }

          if (blockType === 'stepSection') {
            return (
              <div className="my-16" key={index}>
                <StepSectionComponent block={block as StepSection} className={className} />
              </div>
            )
          }

          if (blockType === 'dividerBlock') {
            return (
              <DividerBlockComponent block={block as DividerBlock} className={className} key={index} />
            )
          }

          return null
        })}
      </Fragment>
    )
  }

  return null
}
