import type { CollectionAfterReadHook } from 'payload'
import type { Post } from '../../../payload-types'

export const populateUrl: CollectionAfterReadHook<Post> = async ({ doc, req }) => {
  // Only populate if both category and slug exist
  if (doc.category && doc.slug) {
    doc.url = `/${doc.category}/${doc.slug}`
  }

  return doc
}
