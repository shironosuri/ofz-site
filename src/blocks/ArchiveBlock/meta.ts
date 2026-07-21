import type { BlockMeta } from '../blockMeta'

export const meta = {
  slug: 'archive',
  surfaces: ['page'],
  purpose: 'Displays a hand-picked or filtered archive of posts with optional intro copy.',
  composesWith: ['content', 'mediaBlock', 'cta'],
} satisfies BlockMeta
