import type { CollectionBeforeChangeHook } from 'payload'
import type { Post } from '../../../payload-types'
import { extractArticleText } from '../../../utilities/articleBlocks'

export const calculateReadingTime: CollectionBeforeChangeHook<Post> = async ({ data, req }) => {
  // Only calculate if content exists and readingTime is not manually set
  if (data.content && Array.isArray(data.content)) {
    const plainText = extractArticleText(data.content)
    const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length
    const readingTime = Math.ceil(wordCount / 200) // 200 words per minute

    data.readingTime = readingTime
  }

  return data
}
