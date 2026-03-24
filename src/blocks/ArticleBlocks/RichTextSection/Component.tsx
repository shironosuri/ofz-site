import React from 'react'
import type { RichTextSection } from '@/payload-types'
import RichText from '@/components/RichText'
import { getSectionId } from '@/utilities/articleBlocks'

export const RichTextSectionComponent: React.FC<{
  block: RichTextSection
  className?: string
}> = ({ block, className = '' }) => {
  const sectionId = getSectionId(block)

  return (
    <section id={sectionId || undefined} className={className}>
      {block.heading && (
        <h2 className="text-2xl font-bold mb-4">
          {block.heading}
        </h2>
      )}
      <div className="prose max-w-none dark:prose-invert">
        <RichText data={block.body} enableGutter={false} enableProse={false} />
      </div>
    </section>
  )
}