import React, { Fragment } from 'react'
import type { DividerBlock, RichTextSection, StepSection } from '@/payload-types'
import { DividerBlockComponent } from './DividerBlock/Component'
import { RichTextSectionComponent } from './RichTextSection/Component'
import { StepSectionComponent } from './StepSection/Component'

type ArticleBlock = RichTextSection | StepSection | DividerBlock

const blockComponents = {
  richTextSection: RichTextSectionComponent,
  stepSection: StepSectionComponent,
  dividerBlock: DividerBlockComponent,
} as const

const spacedBlockTypes = new Set<Exclude<ArticleBlock['blockType'], 'dividerBlock'>>([
  'richTextSection',
  'stepSection',
])

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

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents]
            const renderedBlock = <Block block={block as never} className={className} />

            if (spacedBlockTypes.has(blockType as Exclude<ArticleBlock['blockType'], 'dividerBlock'>)) {
              return (
                <div className="my-16" key={index}>
                  {renderedBlock}
                </div>
              )
            }

            return (
              <Fragment key={index}>
                {renderedBlock}
              </Fragment>
            )
          }

          console.warn(`RenderArticleBlocks: unknown blockType "${blockType}"`)
          return null
        })}
      </Fragment>
    )
  }

  return null
}
