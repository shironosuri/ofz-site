import type { Block } from 'payload'
import { getSharedBodyEditorConfig } from '../sharedBodyEditor'

export const RichTextSection: Block = {
  slug: 'richTextSection',
  interfaceName: 'RichTextSection',
  labels: {
    singular: 'Rich Text Section',
    plural: 'Rich Text Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      required: false,
    },
    {
      name: 'sectionSlug',
      type: 'text',
      label: 'Section Slug (Optional ID override)',
      required: false,
      admin: {
        description: 'Override the auto-generated section ID',
      },
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Content',
      required: true,
      editor: getSharedBodyEditorConfig(),
    },
  ],
}