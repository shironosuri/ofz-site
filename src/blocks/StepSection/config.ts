import type { Block } from 'payload'
import { getSharedBodyEditorConfig } from '../sharedBodyEditor'

export const StepSection: Block = {
  slug: 'stepSection',
  interfaceName: 'StepSection',
  labels: {
    singular: 'Step Section',
    plural: 'Step Sections',
  },
  fields: [
    {
      name: 'stepLabel',
      type: 'text',
      label: 'Step Label',
      required: false,
    },
    {
      name: 'stepHeader',
      type: 'text',
      label: 'Step Header',
      required: true,
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