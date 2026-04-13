import { buildEditorState } from '@payloadcms/richtext-lexical'

import type {
  ArchiveBlock,
  ArticleAsideBlock,
  ArticleCalloutBlock,
  ArticleStackGridBlock,
  BannerBlock,
  CallToActionBlock,
  ContentBlock,
  DividerBlock,
  Media,
  MediaBlock,
  RichTextSection,
  StepSection,
} from '@/payload-types'
import type { CodeBlockProps } from '@/blocks/Code/Component'
import type { FormBlockType } from '@/blocks/Form/Component'

const timestamp = '2026-04-10T00:00:00.000Z'
type EditorStateInput = Parameters<typeof buildEditorState>[0]

const sampleMedia = {
  id: 999,
  alt: 'Marked-up article proof, palette swatches, and a notebook on a worktable.',
  caption: buildEditorState({
    nodes: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'A marked-up article proof beside paper swatches and a notebook, used here to show the live media caption treatment inside a page surface.',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
  } as unknown as EditorStateInput),
  createdAt: timestamp,
  updatedAt: timestamp,
  url: '/media/image-hero1.webp',
  thumbnailURL: '/media/image-hero1-300x169.webp',
  filename: 'image-hero1.webp',
  mimeType: 'image/webp',
  filesize: 0,
  width: 1920,
  height: 1080,
  focalX: 50,
  focalY: 50,
} as Media

export const bannerSample: BannerBlock = {
  blockType: 'banner',
  style: 'info',
  content: buildEditorState({
    nodes: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 1,
            mode: 'normal',
            style: '',
            text: 'Surface note:',
            version: 1,
          },
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: ' the previews below use real block output inside staged reading contexts, not detached demo cards.',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
  } as unknown as EditorStateInput),
}

export const articleCalloutSample: ArticleCalloutBlock = {
  blockType: 'articleCallout',
  quote: 'A reference page only becomes trustworthy once the block inherits the surface it was designed for.',
  cite: 'OFZ design system review',
}

export const articleAsideSample: ArticleAsideBlock = {
  blockType: 'articleAside',
  style: 'tip',
  content: buildEditorState({
    nodes: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Use an aside when the reader needs a practical note or constraint without losing the main line of the article.',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
  } as unknown as EditorStateInput),
}

export const articleStackGridSample: ArticleStackGridBlock = {
  blockType: 'articleStackGrid',
  items: [
    {
      label: 'Signal',
      name: 'Orientation',
      description: 'Set the reader’s expectation before a section changes pace or scope.',
    },
    {
      label: 'Signal',
      name: 'Evidence',
      description: 'Bring in examples, references, or supporting detail without derailing the thread.',
    },
    {
      label: 'Signal',
      name: 'Decision',
      description: 'Close with the practical implication so the comparison ends in an editorial choice.',
    },
  ],
}

export const codeBlockSample: CodeBlockProps = {
  blockType: 'code',
  language: 'typescript',
  code: `const stageOrder = {
  page: ['content', 'mediaBlock', 'archive', 'cta', 'formBlock'],
  article: ['richTextSection', 'dividerBlock', 'stepSection'],
  inline: ['banner', 'code', 'articleCallout', 'articleAside', 'articleStackGrid'],
} as const

export function getPreviewSurface(slug: keyof typeof stageOrder.page) {
  return Object.entries(stageOrder).find(([, blocks]) => blocks.includes(slug as never))?.[0]
}`,
}

export const callToActionSample: CallToActionBlock = {
  blockType: 'cta',
  richText: buildEditorState({
    nodes: [
      {
        type: 'heading',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Plan the page before opening the editor.',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        tag: 'h3',
        version: 1,
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Start with the current block set, stage it against the reading surface, and only then decide whether the system is actually missing anything.',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
  } as unknown as EditorStateInput),
  links: [
    {
      link: {
        type: 'custom',
        label: 'Review stage order',
        url: '#blocks',
        appearance: 'default',
      },
    },
    {
      link: {
        type: 'custom',
        label: 'Inspect palette',
        url: '#colors',
        appearance: 'outline',
      },
    },
  ],
}

export const contentBlockSample: ContentBlock = {
  blockType: 'content',
  columns: [
    {
      size: 'full',
      richText: buildEditorState({
        nodes: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'The strongest pages feel edited before they feel designed.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
        ],
      } as unknown as EditorStateInput),
    },
    {
      size: 'oneThird',
      richText: buildEditorState({
        nodes: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Framing',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h3',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Open with the smallest amount of context required to tell the reader what this page is trying to do.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
      } as unknown as EditorStateInput),
    },
    {
      size: 'oneThird',
      richText: buildEditorState({
        nodes: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Evidence',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h3',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Use the middle column for proof: a concrete example, a reference, or a claim the next block will deepen.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
      } as unknown as EditorStateInput),
      enableLink: true,
      link: {
        type: 'custom',
        label: 'See stage preview',
        url: '#blocks',
        appearance: 'default',
      },
    },
    {
      size: 'oneThird',
      richText: buildEditorState({
        nodes: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Next move',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h3',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Close with the action or decision the reader should make after the framing and evidence are in place.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
      } as unknown as EditorStateInput),
    },
  ],
}

export const mediaBlockSample: MediaBlock = {
  blockType: 'mediaBlock',
  media: sampleMedia,
}

export const archiveBlockSample: ArchiveBlock = {
  blockType: 'archive',
  populateBy: 'collection',
  relationTo: 'posts',
  limit: 3,
  introContent: buildEditorState({
    nodes: [
      {
        type: 'heading',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Recent pieces from the seeded archive',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        tag: 'h2',
        version: 1,
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'This preview pulls real posts from the running local Payload instance so the page stage stays honest about live archive output.',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
  } as unknown as EditorStateInput),
}

export const formBlockSample: FormBlockType & { blockType: 'formBlock' } = {
  blockType: 'formBlock',
  enableIntro: true,
  introContent: buildEditorState({
    nodes: [
      {
        type: 'heading',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Minimal form preview',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        tag: 'h3',
        version: 1,
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'This preview keeps the form sample-backed and intentionally empty so the block frame is visible without relying on live CMS form records.',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
  } as unknown as EditorStateInput) as FormBlockType['introContent'],
  form: {
    id: 'reference-form',
    title: 'Newsletter Interest',
    fields: [],
    submitButtonLabel: 'Join the list',
    confirmationType: 'message',
    emails: [],
    confirmationMessage: buildEditorState({
      nodes: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'No confirmation message is shown until a submission completes.',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1,
        },
      ],
    } as unknown as EditorStateInput),
  } as unknown as FormBlockType['form'],
}

export const richTextSectionSample: RichTextSection = {
  blockType: 'richTextSection',
  heading: 'Surface cues tell the reader what kind of attention to bring.',
  body: buildEditorState({
    nodes: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'A good article surface does not rely on novelty. It relies on a stable reading rhythm, clear hierarchy, and enough space for the argument to unfold without visual noise.',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'That is why section-level blocks should be previewed inside a believable article register. Without it, the hierarchy flattens and the block starts to read like a fragment rather than a section.',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
  } as unknown as EditorStateInput),
}

export const stepSectionSample: StepSection = {
  blockType: 'stepSection',
  stepLabel: 'Step 03',
  stepHeader: 'Stage the block where it will actually be read.',
  body: buildEditorState({
    nodes: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: 'Before adding a new pattern, place the existing block inside a truthful page, article, or inline surface. A large share of “missing block” requests disappear once the context is correct.',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
  } as unknown as EditorStateInput),
}

export const dividerBlockSample: DividerBlock = {
  blockType: 'dividerBlock',
}
