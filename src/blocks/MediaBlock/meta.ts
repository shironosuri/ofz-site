import type { BlockMeta } from '../blockMeta'

export const meta = {
  slug: 'mediaBlock',
  surfaces: ['page', 'inline'],
  purpose: 'Displays a single media asset with an optional rich-text caption.',
  composesWith: ['content', 'archive', 'cta'],
} satisfies BlockMeta
