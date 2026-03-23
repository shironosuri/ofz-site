import type { Block } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  lexicalEditor,
  type LinkFields,
} from '@payloadcms/richtext-lexical'

export const ArticleAside: Block = {
  slug: 'articleAside',
  interfaceName: 'ArticleAsideBlock',
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'note',
      options: [
        { label: 'Note', value: 'note' },
        { label: 'Warning', value: 'warning' },
        { label: 'Tip', value: 'tip' },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: [
          BoldFeature(),
          ItalicFeature(),
        ],
      }),
      label: false,
      required: true,
    },
  ],
}
