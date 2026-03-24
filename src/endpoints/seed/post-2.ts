import { RequiredDataFromCollectionSlug } from 'payload'
import type { PostArgs } from './post-1'

export const post2: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({
  heroImage,
  blockImage,
  author,
}) => {
  return {
    slug: 'global-gaze',
    _status: 'published',
    authors: [author],
    category: 'theory',
    content: [
      {
        blockType: 'richTextSection',
        heading: 'Explore the untold and overlooked. A magnified view into the corners of the world, where every story deserves its spotlight.',
        body: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'In an era of information overload, some of the most compelling narratives often remain hidden in the shadows. This series aims to illuminate those overlooked stories, giving voice to the voiceless and shedding light on the extraordinary within the ordinary.',
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
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
      {
        blockType: 'stepSection',
        stepLabel: 'Step 1',
        stepHeader: 'Identifying Hidden Narratives',
        body: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'The first challenge is recognizing stories that deserve attention but have been overlooked by mainstream media. This requires a keen eye for the unusual, the marginalized, and the profoundly human.',
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
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
      {
        blockType: 'stepSection',
        stepLabel: 'Step 2',
        stepHeader: 'Amplifying Diverse Voices',
        body: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Once identified, these stories need platforms that can amplify them without distortion. This involves building trust with communities and ensuring authentic representation.',
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
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
      {
        blockType: 'richTextSection',
        heading: 'The Impact of Storytelling',
        body: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'When overlooked stories find their audience, they have the power to challenge assumptions, build empathy, and inspire action. Storytelling becomes a bridge between worlds, connecting people across cultures and experiences.',
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
                type: 'block',
                fields: {
                  blockName: '',
                  blockType: 'mediaBlock',
                  media: blockImage.id,
                },
                format: '',
                version: 2,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
      {
        blockType: 'richTextSection',
        heading: 'Storytelling Methods Comparison',
        body: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Different approaches to storytelling can be compared using our stack grid:',
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
                type: 'block',
                fields: {
                  blockName: 'Methodology Comparison',
                  blockType: 'articleStackGrid',
                  items: [
                    {
                      label: 'Interviews',
                      name: 'First-person Accounts',
                      description: 'Direct quotes and personal narratives',
                    },
                    {
                      label: 'Investigation',
                      name: 'Research-based',
                      description: 'Data-driven and factual reporting',
                    },
                    {
                      label: 'Narrative',
                      name: 'Story Arc',
                      description: 'Structured storytelling with beginning, middle, end',
                    },
                  ],
                },
                format: '',
                version: 2,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
    ],
    heroImage: heroImage.id,
    meta: {
      description:
        'Explore the untold and overlooked. A magnified view into the corners of the world, where every story deserves its spotlight.',
      image: heroImage.id,
      title: 'Global Gaze: Uncovering Hidden Narratives',
    },
    relatedPosts: [],
    title: 'Global Gaze: Uncovering Hidden Narratives',
  }
}
