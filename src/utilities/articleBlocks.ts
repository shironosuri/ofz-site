import type { DividerBlock, RichTextSection, StepSection } from '../payload-types'

/**
 * Extract plain text from an article block
 */
export function extractBlockText(block: RichTextSection | StepSection | DividerBlock): string {
  if (block.blockType === 'dividerBlock') return ''
  if (!block.body || !block.body.root) return ''

  let text = ''

  // Add heading if present
  if ('heading' in block && block.heading) {
    text += block.heading + ' '
  }

  // Add step header if present
  if ('stepHeader' in block && block.stepHeader) {
    text += block.stepHeader + ' '
  }

  // Add step label if present
  if ('stepLabel' in block && block.stepLabel) {
    text += block.stepLabel + ' '
  }

  // Traverse rich text children
  function traverseChildren(children: any[]): void {
    if (!children) return

    for (const child of children) {
      if (child.type === 'text') {
        text += child.text + ' '
      } else if (child.children) {
        traverseChildren(child.children)
      }
    }
  }

  traverseChildren(block.body.root.children)
  return text.trim()
}

/**
 * Extract plain text from an array of article blocks
 */
export function extractArticleText(blocks: (RichTextSection | StepSection | DividerBlock)[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  return blocks.map(extractBlockText).join(' ')
}

/**
 * Generate a section ID from a heading
 */
export function generateSectionId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Get section ID for a block
 * Returns null if block should not have an ID (RichTextSection without heading)
 */
export function getSectionId(block: RichTextSection | StepSection | DividerBlock): string | null {
  if (block.blockType === 'dividerBlock') {
    return null
  }

  // If sectionSlug is explicitly provided, use it
  if (block.sectionSlug) {
    return block.sectionSlug
  }

  // For RichTextSection, only generate ID if heading exists
  if (block.blockType === 'richTextSection') {
    const richTextBlock = block as RichTextSection
    if (richTextBlock.heading) {
      return generateSectionId(richTextBlock.heading)
    }
    // No heading, no ID
    return null
  }

  // For StepSection, generate ID from stepHeader
  if (block.blockType === 'stepSection') {
    const stepBlock = block as StepSection
    if (stepBlock.stepHeader) {
      return generateSectionId(stepBlock.stepHeader)
    }
  }

  return null
}
