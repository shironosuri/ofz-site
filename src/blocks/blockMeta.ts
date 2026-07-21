export type BlockMeta = {
  /** Must match the slug in config.ts exactly */
  slug: string
  /** Which surfaces this block is registered on */
  surfaces: Array<'page' | 'article' | 'inline'>
  /** One sentence describing what the block is for */
  purpose: string
  /** When an agent or editor should choose this block */
  whenToUse?: string[]
  /** When this block is the wrong choice */
  whenNotToUse?: string[]
  /** Slugs of blocks that compose well alongside this one */
  composesWith?: string[]
  /** Conditions under which a new block is not needed because this block covers it */
  replacesNeedForNewBlockWhen?: string[]
}
