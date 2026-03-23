import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
  category?: string
}

export const generatePreviewPath = ({ collection, slug, req, category }: Props) => {
  // Allow empty strings, e.g. for the homepage
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  // For posts, we need to determine the category from the document
  let path = `${collectionPrefixMap[collection]}/${encodedSlug}`
  
  if (collection === 'posts' && req) {
    // Try to get category from the request data
    const data = req.data
    if (data && data.category) {
      path = `/${data.category}/${encodedSlug}`
    } else if (category) {
      // Fallback to category parameter if provided
      path = `/${category}/${encodedSlug}`
    }
  }

  const encodedParams = new URLSearchParams({
    slug: encodedSlug,
    collection,
    path: path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}
