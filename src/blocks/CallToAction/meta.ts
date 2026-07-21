import type { BlockMeta } from '../blockMeta'

export const meta = {
  slug: 'cta',
  surfaces: ['page'],
  purpose: 'Prompts a next action with short rich text and one or more links.',
  composesWith: ['content', 'mediaBlock', 'archive'],
} satisfies BlockMeta
