import { describe, expect, it } from 'vitest'

import { getManualRegistrationInstructions, toBlockSlug } from './new-block.mjs'

describe('toBlockSlug', () => {
  it.each([
    ['TestScaffold', 'testScaffold'],
    ['CallToAction', 'callToAction'],
    ['RichTextSection', 'richTextSection'],
    ['Code', 'code'],
    ['ArticleCallout', 'articleCallout'],
  ])('maps %s to %s', (name, expected) => {
    expect(toBlockSlug(name)).toBe(expected)
  })
})

describe('getManualRegistrationInstructions', () => {
  it('returns complete page-scope instructions', () => {
    expect(getManualRegistrationInstructions('TestScaffold', 'page')).toEqual({
      heading: 'Manual registration required for TestScaffold (--scope page):',
      steps: [
        {
          filePath: 'src/collections/Pages/index.ts',
          instructions: [
            "Add import:  import { TestScaffold } from '../../blocks/TestScaffold/config'",
            'Add to blocks array: blocks: [..., TestScaffold]',
          ],
        },
        {
          filePath: 'src/blocks/RenderBlocks.tsx',
          instructions: [
            "Add import:  import { TestScaffold as TestScaffoldComponent } from '@/blocks/TestScaffold/Component'",
            'Add to blockComponents map: testScaffold: TestScaffoldComponent,',
          ],
        },
      ],
    })
  })

  it('returns complete article-scope instructions', () => {
    expect(getManualRegistrationInstructions('TestScaffold', 'article')).toEqual({
      heading: 'Manual registration required for TestScaffold (--scope article):',
      steps: [
        {
          filePath: 'src/collections/Posts/index.ts',
          instructions: [
            "Add import:  import { TestScaffold } from '../../blocks/TestScaffold/config'",
            'Add to blocks array: blocks: [..., TestScaffold]',
          ],
        },
        {
          filePath: 'src/blocks/RenderArticleBlocks.tsx',
          instructions: [
            "Add type import:  import type { TestScaffoldBlock as TestScaffoldBlockProps } from '@/payload-types'",
            "Add component import:  import { TestScaffold as TestScaffoldComponent } from '@/blocks/TestScaffold/Component'",
            'Extend ArticleBlock union:  | TestScaffoldBlockProps',
            'Add to blockComponents map: testScaffold: TestScaffoldComponent,',
          ],
        },
      ],
    })
  })

  it('returns complete inline-scope instructions', () => {
    expect(getManualRegistrationInstructions('TestScaffold', 'inline')).toEqual({
      heading: 'Manual registration required for TestScaffold (--scope inline):',
      steps: [
        {
          filePath: 'src/blocks/sharedBodyEditor.ts',
          instructions: [
            "Add import:  import { TestScaffold } from '@/blocks/TestScaffold/config'",
            'Add to BlocksFeature array: TestScaffold',
          ],
        },
        {
          filePath: 'src/components/RichText/index.tsx',
          instructions: [
            "Add type import:  import type { TestScaffoldBlock as TestScaffoldBlockProps } from '@/payload-types'",
            "Add component import:  import { TestScaffold as TestScaffoldComponent } from '@/blocks/TestScaffold/Component'",
            'Add to SerializedBlockNode union:  | TestScaffoldBlockProps',
            'Add to blocks converter map: testScaffold: ({ node }) => <TestScaffoldComponent {...node.fields} />,',
          ],
        },
      ],
    })
  })
})
