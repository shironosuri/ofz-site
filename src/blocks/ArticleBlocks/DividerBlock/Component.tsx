import React from 'react'
import type { DividerBlock } from '@/payload-types'

export const DividerBlockComponent: React.FC<{
  block: DividerBlock
  className?: string
}> = ({ className = '' }) => {
  return (
    <section aria-hidden="true" className={className}>
      <hr />
    </section>
  )
}
