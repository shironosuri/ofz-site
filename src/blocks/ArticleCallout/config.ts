import type { Block } from 'payload'

export const ArticleCallout: Block = {
  slug: 'articleCallout',
  interfaceName: 'ArticleCalloutBlock',
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      label: 'Quote',
      required: true,
    },
    {
      name: 'cite',
      type: 'text',
      label: 'Citation',
    },
  ],
}
