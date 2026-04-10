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
  alt: 'Editorial still life used for the design system reference page.',
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
            text: 'Sample media caption set in Payload-style rich text to show the live caption treatment.',
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
  style: 'warning',
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
            text: 'Reference note:',
            version: 1,
          },
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: ' this page shows live block output, not approximations.',
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
  quote: 'The design system should make the right decision feel obvious, not decorative.',
  cite: 'Editorial systems note',
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
            text: 'Use article asides for supporting context that should stay visibly secondary to the main argument.',
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
      label: 'Tone',
      name: 'Editorial',
      description: 'Use for narrative voice, context, and paced reading.',
    },
    {
      label: 'Tone',
      name: 'Utility',
      description: 'Use for controls, labels, and compact interface language.',
    },
    {
      label: 'Tone',
      name: 'Technical',
      description: 'Use for code, diagnostics, and dense reference content.',
    },
  ],
}

export const codeBlockSample: CodeBlockProps = {
  blockType: 'code',
  language: 'typescript',
  code: `export function mapDecision(input: 'page' | 'block') {
  return input === 'page' ? 'standalone route' : 'editorial reuse'
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
            text: 'Turn a reference page into an implementation plan.',
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
            text: 'Use the current block inventory first, then add only what the system genuinely lacks.',
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
        label: 'Review blocks',
        url: '#blocks',
        appearance: 'default',
      },
    },
    {
      link: {
        type: 'custom',
        label: 'Scan typography',
        url: '#typography',
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
                text: 'A page-level content block can mix framing copy, explanation, and links.',
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
                text: 'Context',
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
                text: 'Use a narrow column when the copy needs to read as a concise setup rather than a full section.',
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
                text: 'Argument',
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
                text: 'The content block works best when text needs editorial rhythm without requiring a bespoke layout.',
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
        label: 'See color palette',
        url: '#colors',
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
                text: 'Decision',
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
                text: 'If the need is heading plus copy plus optional action, reuse this before proposing a new block.',
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
            text: 'Live archive preview',
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
            text: 'This block fetches real posts from the running local Payload instance.',
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
            text: 'Fallback form state',
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
            text: 'This preview intentionally passes an empty field list so the block renders its minimal state without requiring a seeded form.',
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
    title: 'Reference Form',
    fields: [],
    submitButtonLabel: 'Submit',
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
  heading: 'Typography should carry argument, not just ornament.',
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
            text: 'Use a rich text section when the reader needs a clearly signposted editorial segment with enough room for explanation.',
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
            text: 'The point of the section is not decoration. It is pacing, hierarchy, and a reliable place for longer-form reasoning.',
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
  stepLabel: 'Step 02',
  stepHeader: 'Match the block to the editorial job.',
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
            text: 'A step section works when the sequence matters and each section should feel like a deliberate stage in the reader’s progress.',
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
