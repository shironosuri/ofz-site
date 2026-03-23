import type { Block } from 'payload'

export const ArticleStackGrid: Block = {
  slug: 'articleStackGrid',
  interfaceName: 'ArticleStackGridBlock',
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Items',
      minRows: 2,
      required: true,
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          label: 'Name',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
        },
      ],
    },
  ],
}
