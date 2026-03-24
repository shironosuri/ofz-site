import React from 'react'
import type { StepSection } from '@/payload-types'
import RichText from '@/components/RichText'
import { getSectionId } from '@/utilities/articleBlocks'

export const StepSectionComponent: React.FC<{
  block: StepSection
  className?: string
}> = ({ block, className = '' }) => {
  const sectionId = getSectionId(block)

  return (
    <section id={sectionId || undefined} className={className}>
      <div className="mb-4">
        {block.stepLabel && (
          <div className="step-label">
            {block.stepLabel}
          </div>
        )}
        <h2 className="text-2xl font-bold">
          {block.stepHeader}
        </h2>
      </div>
      <div className="prose max-w-none dark:prose-invert">
        <RichText data={block.body} enableGutter={false} enableProse={false} />
      </div>
    </section>
  )
}
