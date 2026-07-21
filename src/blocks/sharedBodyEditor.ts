import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  OrderedListFeature,
  UnorderedListFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { ArticleCallout } from '@/blocks/ArticleCallout/config'
import { ArticleAside } from '@/blocks/ArticleAside/config'
import { ArticleStackGrid } from '@/blocks/ArticleStackGrid/config'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'

export const getSharedBodyEditorConfig = () => {
  return lexicalEditor({
    features: ({ rootFeatures }) => {
      return [
        ...rootFeatures,
        HeadingFeature({ enabledHeadingSizes: ['h3', 'h4', 'h5', 'h6'] }),
        UnorderedListFeature(),
        OrderedListFeature(),
        BlocksFeature({ blocks: [Banner, Code, MediaBlock, ArticleCallout, ArticleAside, ArticleStackGrid] }),
        FixedToolbarFeature(),
        InlineToolbarFeature(),
        HorizontalRuleFeature(),
      ]
    },
  })
}
