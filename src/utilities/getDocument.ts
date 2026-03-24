import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Collection = keyof Config['collections']

async function getDocumentByID(collection: Collection, id: number, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const document = await payload.findByID({
    collection,
    depth,
    id,
    overrideAccess: false,
  })

  return document
}

/**
 * Returns an unstable_cache function mapped with the cache tag for the document ID.
 */
export const getCachedDocumentByID = (collection: Collection, id: number) =>
  unstable_cache(async () => getDocumentByID(collection, id), [collection, String(id)], {
    tags: [`${collection}_${id}`],
  })
