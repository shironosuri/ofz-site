import type { BlockMeta } from '../blockMeta'

export const meta = {
  slug: 'content',
  surfaces: ['page'],
  purpose: 'Arranges page-level rich text and optional links in configurable editorial columns.',
  composesWith: ['mediaBlock', 'archive', 'cta'],
} satisfies BlockMeta
