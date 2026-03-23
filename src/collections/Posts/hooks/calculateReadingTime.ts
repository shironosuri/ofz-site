import type { CollectionBeforeChangeHook } from 'payload'
import type { Post } from '../../../payload-types'

// Extract plain text from Lexical JSON content
function extractPlainText(lexicalContent: any): string {
  if (!lexicalContent || !lexicalContent.root) return ''

  let text = ''

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

  traverseChildren(lexicalContent.root.children)
  return text.trim()
}

export const calculateReadingTime: CollectionBeforeChangeHook<Post> = async ({ data, req }) => {
  // Only calculate if content exists and readingTime is not manually set
  if (data.content) {
    const plainText = extractPlainText(data.content)
    const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length
    const readingTime = Math.ceil(wordCount / 200) // 200 words per minute

    data.readingTime = readingTime
  }

  return data
}
