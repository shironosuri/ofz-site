import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ req, originalDoc, searchDoc }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  const { slug, id, category, title, meta } = originalDoc

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
    category,
    meta: {
      ...meta,
      title: meta?.title || title,
      image: meta?.image?.id || meta?.image,
      description: meta?.description,
    },
  }

  return modifiedDoc
}
