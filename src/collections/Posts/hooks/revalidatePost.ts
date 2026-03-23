import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Post } from '../../../payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published' && doc.category && doc.slug) {
      const path = `/${doc.category}/${doc.slug}`
      const categoryPath = `/${doc.category}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidatePath(categoryPath)
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && previousDoc.category && previousDoc.slug) {
      const oldPath = `/${previousDoc.category}/${previousDoc.slug}`
      const oldCategoryPath = `/${previousDoc.category}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath(oldCategoryPath)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate && doc?.category && doc?.slug) {
    const path = `/${doc.category}/${doc.slug}`
    const categoryPath = `/${doc.category}`

    revalidatePath(path)
    revalidatePath(categoryPath)
  }

  return doc
}
