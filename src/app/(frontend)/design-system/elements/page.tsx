import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import blockCatalog from '../../../../../design-system/block-catalog.json'
import '@/components/ContentRegister/content-register.css'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { ArticleAsideBlock } from '@/blocks/ArticleAside/Component'
import { ArticleCalloutBlock } from '@/blocks/ArticleCallout/Component'
import { ArticleStackGridBlock } from '@/blocks/ArticleStackGrid/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CodeBlock } from '@/blocks/Code/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { DividerBlockComponent } from '@/blocks/DividerBlock/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { RichTextSectionComponent } from '@/blocks/RichTextSection/Component'
import { StepSectionComponent } from '@/blocks/StepSection/Component'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import {
  archiveBlockSample,
  articleAsideSample,
  articleCalloutSample,
  articleStackGridSample,
  bannerSample,
  callToActionSample,
  codeBlockSample,
  contentBlockSample,
  dividerBlockSample,
  formBlockSample,
  mediaBlockSample,
  richTextSectionSample,
  stepSectionSample,
} from './samples'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  robots: 'noindex',
}

type CatalogBlock = (typeof blockCatalog.blocks)[number]

type SectionTone = 'typography' | 'colors' | 'primitives' | 'blocks'
type PreviewSurface = 'page' | 'article' | 'inline'

function PageSection({
  id,
  eyebrow,
  title,
  description,
  tone,
  aside,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  description: string
  tone: SectionTone
  aside: ReactNode
  children: ReactNode
}) {
  const toneStyles: Record<
    SectionTone,
    {
      wrapper: string
      eyebrow: string
      title: string
      description: string
      aside: string
    }
  > = {
    typography: {
      wrapper: 'border-content-rule bg-content-paper',
      eyebrow: 'text-brand-accent',
      title: 'text-content-ink',
      description: 'text-content-copy',
      aside: 'border-content-rule bg-background',
    },
    colors: {
      wrapper: 'border-brand-accent/30 bg-card',
      eyebrow: 'text-brand-accent',
      title: 'text-content-ink',
      description: 'text-muted-foreground',
      aside: 'border-content-rule bg-content-paper',
    },
    primitives: {
      wrapper: 'border-border bg-background',
      eyebrow: 'text-content-caption',
      title: 'text-foreground',
      description: 'text-muted-foreground',
      aside: 'border-border bg-card',
    },
    blocks: {
      wrapper: 'border-content-ink bg-content-ink',
      eyebrow: 'text-content-caption',
      title: 'text-content-paper',
      description: 'text-content-cream',
      aside: 'border-content-rule/60 bg-content-paper text-content-ink',
    },
  }

  const styles = toneStyles[tone]

  return (
    <section className="border-b border-border py-16 lg:py-20" id={id}>
      <div className="container">
        <div className={`mb-8 rounded-3xl border px-6 py-6 lg:px-8 ${styles.wrapper}`}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(15rem,1fr)] lg:items-start">
            <div>
              <p className={`font-ui-mono text-2xs uppercase tracking-[0.3em] ${styles.eyebrow}`}>
                {eyebrow}
              </p>
              <h2 className={`mt-4 max-w-3xl font-display text-heading leading-snug ${styles.title}`}>
                {title}
              </h2>
              <p className={`mt-3 max-w-2xl text-base leading-relaxed ${styles.description}`}>
                {description}
              </p>
            </div>
            <div className={`rounded-2xl border p-4 ${styles.aside}`}>
              {aside}
            </div>
          </div>
        </div>
        {children}
      </div>
    </section>
  )
}

function ColorSwatch({
  label,
  value,
  swatchClassName,
  textClassName = 'text-card-foreground',
}: {
  label: string
  value: string
  swatchClassName: string
  textClassName?: string
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-content-rule bg-background">
      <div className={`h-16 border-b border-content-rule ${swatchClassName}`} />
      <div className="px-4 py-3">
        <p className="font-ui-mono text-xs uppercase tracking-[0.2em] text-content-caption">
          {label}
        </p>
        <p className={`mt-1 font-ui-mono text-xs ${textClassName}`}>{value}</p>
      </div>
    </div>
  )
}

function SurfaceStage({
  surface,
  eyebrow,
  title,
  description,
  children,
}: {
  surface: PreviewSurface
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  const stageStyles: Record<
    PreviewSurface,
    {
      shell: string
      eyebrow: string
      title: string
      description: string
    }
  > = {
    page: {
      shell: 'border-content-rule bg-content-paper',
      eyebrow: 'text-brand-accent',
      title: 'text-content-ink',
      description: 'text-content-copy',
    },
    article: {
      shell: 'border-content-rule bg-content-paper',
      eyebrow: 'text-brand-accent',
      title: 'text-content-ink',
      description: 'text-content-copy',
    },
    inline: {
      shell: 'border-border bg-card',
      eyebrow: 'text-content-caption',
      title: 'text-foreground',
      description: 'text-muted-foreground',
    },
  }

  const styles = stageStyles[surface]

  return (
    <section
      className={`rounded-[2rem] border p-6 lg:p-8 ${styles.shell}`}
      data-preview-surface={surface}
    >
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className={`font-ui-mono text-xs uppercase tracking-[0.24em] ${styles.eyebrow}`}>
            {eyebrow}
          </p>
          <h3 className={`mt-3 font-display text-lead ${styles.title}`}>{title}</h3>
          <p className={`mt-2 text-sm leading-relaxed ${styles.description}`}>{description}</p>
        </div>
        <Badge variant="outline">{surface}</Badge>
      </div>
      {children}
    </section>
  )
}

function BlockPreview({
  block,
  children,
}: {
  block: CatalogBlock
  children: ReactNode
}) {
  return (
    <article className="space-y-3" data-block-slug={block.slug}>
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-ui-mono text-2xs uppercase tracking-[0.2em] text-content-caption">
          {block.slug}
        </p>
        {block.surfaces.map((surface) => (
          <Badge key={`${block.slug}-${surface}`} variant="outline">
            {surface}
          </Badge>
        ))}
        <p className="basis-full text-sm leading-relaxed text-muted-foreground">{block.purpose}</p>
      </div>
      {children}
    </article>
  )
}

export default function DesignSystemElementsPage() {
  const blocks = blockCatalog.blocks as CatalogBlock[]
  const previewSurfaces = Array.from(new Set(blocks.flatMap((block) => block.surfaces)))
  const sectionLinks = [
    { href: '#typography', label: 'Typography' },
    { href: '#colors', label: 'Colors' },
    { href: '#ui-primitives', label: 'UI Primitives' },
    { href: '#blocks', label: 'Blocks' },
  ] as const
  const typographyFamilies = [
    {
      label: 'font-display',
      className: 'font-display text-heading leading-tight text-content-ink',
      sample: 'The sentence should feel cut, weighted, and deliberate.',
    },
    {
      label: 'font-body',
      className: 'font-body text-body leading-body text-content-copy',
      sample: 'Long-form explanation needs to stay clear, warm, and easy to track across extended reading.',
    },
    {
      label: 'font-mono',
      className: 'font-mono text-sm leading-code text-content-comment',
      sample: 'pnpm tsc --noEmit  status: clean  target: local',
    },
    {
      label: 'font-ui-sans',
      className: 'font-ui-sans text-base leading-snug text-foreground',
      sample: 'Interface language should stay compact and frictionless.',
    },
    {
      label: 'font-ui-mono',
      className: 'font-ui-mono text-xs leading-code text-content-copy',
      sample: 'route=/design-system/elements  robots=noindex  mode=force-dynamic',
    },
  ] as const
  const typeScale = [
    {
      label: 'text-2xs',
      className: 'text-2xs text-content-copy',
      sample: 'Compact metadata and system labels.',
    },
    {
      label: 'text-xs',
      className: 'text-xs text-content-copy',
      sample: 'Small but still legible supporting interface copy.',
    },
    {
      label: 'text-sm',
      className: 'text-sm text-content-copy',
      sample: 'Helper text, captions, and dense UI description.',
    },
    {
      label: 'text-base',
      className: 'text-base text-content-copy',
      sample: 'Default interface copy and standard body text.',
    },
    {
      label: 'text-body',
      className: 'text-body leading-body text-content-copy',
      sample: 'Editorial body copy with comfortable reading rhythm.',
    },
    {
      label: 'text-lead',
      className: 'text-lead leading-relaxed text-content-copy',
      sample: 'Lead paragraphs that need more air and emphasis.',
    },
    {
      label: 'text-heading',
      className: 'font-display text-heading leading-snug text-content-ink',
      sample: 'Section headings with visible editorial lift.',
    },
    {
      label: 'text-hero',
      className: 'font-display text-hero leading-tight text-content-ink',
      sample: 'A marquee line that sets the page’s register.',
    },
  ] as const
  const fontWeights = [
    {
      label: 'font-light',
      className: 'font-light text-base text-content-copy',
      sample: 'font-light keeps emphasis understated.',
    },
    {
      label: 'font-normal',
      className: 'font-normal text-base text-content-copy',
      sample: 'font-normal holds the baseline reading voice.',
    },
    {
      label: 'font-medium',
      className: 'font-medium text-base text-content-copy',
      sample: 'font-medium gives UI labels and subheads extra pull.',
    },
    {
      label: 'font-bold',
      className: 'font-bold text-base text-content-ink',
      sample: 'font-bold lands the strongest statements and headings.',
    },
  ] as const
  const lineHeights = [
    {
      label: 'leading-tight',
      className: 'leading-tight text-base text-content-copy',
      sample: 'leading-tight compresses headline lines for sharp, stacked display copy.',
    },
    {
      label: 'leading-snug',
      className: 'leading-snug text-base text-content-copy',
      sample: 'leading-snug keeps headings compact without becoming cramped.',
    },
    {
      label: 'leading-relaxed',
      className: 'leading-relaxed text-base text-content-copy',
      sample: 'leading-relaxed opens introductory or reflective copy.',
    },
    {
      label: 'leading-body',
      className: 'leading-body text-base text-content-copy',
      sample: 'leading-body sets the default editorial reading rhythm.',
    },
    {
      label: 'leading-code',
      className: 'font-mono text-sm leading-code text-content-comment',
      sample: 'leading-code supports dense monospace snippets without collapsing.',
    },
    {
      label: 'leading-quote',
      className: 'font-display text-lead leading-quote text-content-ink',
      sample: 'leading-quote gives emphasized quotations room to breathe.',
    },
  ] as const
  const primitiveSpecimens = [
    {
      title: 'Button',
      description: 'Shared action states and emphasis levels.',
      preview: (
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      ),
    },
    {
      title: 'Badge',
      description: 'Compact status and metadata treatment.',
      preview: (
        <div className="flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      ),
    },
    {
      title: 'Card',
      description: 'Container primitive with header, body, and footer slots.',
      preview: (
        <Card className="max-w-md shadow-none">
          <CardHeader className="pb-4">
            <CardTitle>Reference card</CardTitle>
            <CardDescription>
              Use this when content needs a bounded semantic surface.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button size="sm" variant="outline">
              Inspect
            </Button>
          </CardFooter>
        </Card>
      ),
    },
    {
      title: 'Input',
      description: 'Shared text-field baseline.',
      preview: (
        <div className="grid max-w-md gap-3">
          <Input defaultValue="Editorial systems stay legible under load." type="text" />
          <Input defaultValue="hello@onefromzero.dev" type="email" />
        </div>
      ),
    },
    {
      title: 'Separator',
      description: 'Horizontal and vertical division without inventing bespoke rules.',
      preview: (
        <div className="grid max-w-xl gap-5">
          <div className="grid gap-3">
            <p className="text-sm text-muted-foreground">Horizontal</p>
            <Separator />
          </div>
          <div className="flex h-16 items-center gap-4">
            <span className="text-sm text-muted-foreground">Left</span>
            <Separator orientation="vertical" />
            <span className="text-sm text-muted-foreground">Right</span>
          </div>
        </div>
      ),
    },
  ] as const
  const blockLookup = Object.fromEntries(blocks.map((block) => [block.slug, block])) as Record<
    string,
    CatalogBlock
  >
  const pageStageOrder = ['content', 'mediaBlock', 'archive', 'cta', 'formBlock'] as const
  const articleStageOrder = ['richTextSection', 'dividerBlock', 'stepSection'] as const
  const inlineStageOrder = [
    'banner',
    'code',
    'articleCallout',
    'articleAside',
    'articleStackGrid',
  ] as const

  const blockPreviews: Record<string, ReactNode> = {
    articleAside: <ArticleAsideBlock {...articleAsideSample} />,
    articleCallout: <ArticleCalloutBlock {...articleCalloutSample} />,
    articleStackGrid: <ArticleStackGridBlock {...articleStackGridSample} />,
    banner: <BannerBlock {...bannerSample} />,
    cta: <CallToActionBlock {...callToActionSample} />,
    code: <CodeBlock {...codeBlockSample} />,
    content: <ContentBlock {...contentBlockSample} />,
    dividerBlock: <DividerBlockComponent block={dividerBlockSample} className="my-10" />,
    formBlock: <FormBlock {...formBlockSample} />,
    mediaBlock: <MediaBlock {...mediaBlockSample} />,
    richTextSection: <RichTextSectionComponent block={richTextSectionSample} />,
    stepSection: <StepSectionComponent block={stepSectionSample} />,
  }

  return (
    <main className="bg-background pb-24 text-foreground">
      <header className="border-b border-content-rule bg-content-paper">
        <div className="container py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(18rem,1fr)] lg:items-end">
            <div>
              <p className="font-ui-mono text-2xs uppercase tracking-[0.35em] text-brand-accent">
                Design System
              </p>
              <h1 className="mt-4 max-w-4xl font-display text-hero leading-tight text-content-ink">
                A live reference for the site’s type, palette, primitives, and editorial blocks.
              </h1>
              <p className="mt-4 max-w-3xl text-body leading-body text-content-copy">
                This route is a working system reference rather than a marketing surface. It stays
                public, dynamic, and noindex so the team can inspect the current design language
                with real components and truthful wrappers.
              </p>
              <nav aria-label="Jump to elements sections" className="mt-8">
                <div className="flex flex-wrap gap-3">
                  {sectionLinks.map((link) => (
                    <a
                      key={link.href}
                      className="inline-flex items-center rounded-full border border-content-rule bg-background px-4 py-2 font-ui-mono text-xs uppercase tracking-[0.24em] text-content-copy transition-colors hover:border-brand-accent hover:text-brand-accent"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </nav>
            </div>

            <aside className="rounded-3xl border border-content-rule bg-background p-6">
              <p className="font-ui-mono text-2xs uppercase tracking-[0.3em] text-content-caption">
                Route Snapshot
              </p>
              <dl className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="font-ui-mono text-xs uppercase tracking-[0.24em] text-content-caption">
                    Sections
                  </dt>
                  <dd className="mt-2 font-display text-heading leading-tight text-content-ink">4</dd>
                </div>
                <div>
                  <dt className="font-ui-mono text-xs uppercase tracking-[0.24em] text-content-caption">
                    Live Blocks
                  </dt>
                  <dd className="mt-2 font-display text-heading leading-tight text-content-ink">
                    {blocks.length}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-content-rule pt-5">
                <p className="font-ui-mono text-xs uppercase tracking-[0.24em] text-content-caption">
                  Preview Surfaces
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {previewSurfaces.map((surface) => (
                    <Badge key={surface} variant="outline">
                      {surface}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-content-copy">
                  Contract preserved: `noindex`, `force-dynamic`, and the existing four section IDs.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </header>

      <PageSection
        id="typography"
        eyebrow="Typography"
        title="Type is mapped to live utility aliases and Tailwind built-ins."
        description="The specimens below show the live family aliases, the full scale from text-2xs through text-hero, built-in weight classes, and all six line-height utilities."
        tone="typography"
        aside={
          <div className="space-y-4">
            <p className="font-ui-mono text-xs uppercase tracking-[0.24em] text-content-caption">
              Reading register
            </p>
            <div className="space-y-3">
              <p className="font-display text-lead leading-snug text-content-ink">
                Display and body styles should feel deliberate before they feel decorative.
              </p>
              <p className="text-sm leading-relaxed text-content-copy">
                This section keeps the alias layer readable: families, sizes, weights, and line
                heights are visible as reference specimens rather than hidden in implementation.
              </p>
            </div>
          </div>
        }
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="rounded-3xl border border-content-rule bg-content-paper p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-ui-mono text-xs uppercase tracking-[0.24em] text-content-caption">
                  Family matrix
                </p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-content-copy">
                  The five font families read as distinct working voices rather than isolated demo
                  cards.
                </p>
              </div>
              <Badge variant="outline">5 live aliases</Badge>
            </div>
            <div className="mt-6 grid gap-3">
              {typographyFamilies.map((family) => (
                <div
                  key={family.label}
                  className="grid gap-3 rounded-2xl border border-content-rule bg-background px-4 py-4 md:grid-cols-[9rem_1fr] md:items-baseline"
                >
                  <p className="font-ui-mono text-xs uppercase tracking-[0.2em] text-content-caption">
                    {family.label}
                  </p>
                  <p className={family.className}>{family.sample}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-content-rule bg-background p-6 lg:p-8">
            <p className="font-ui-mono text-xs uppercase tracking-[0.24em] text-content-caption">
              Continuous scale
            </p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-content-copy">
              The size ladder stays in one uninterrupted specimen so the rhythm between steps is
              easier to compare.
            </p>
            <div className="mt-6 grid gap-3">
              {typeScale.map((scale, index) => (
                <div
                  key={scale.label}
                  className={`grid gap-3 md:grid-cols-[7rem_1fr] md:items-baseline ${
                    index === typeScale.length - 1 ? '' : 'border-b border-content-rule/70 pb-3'
                  }`}
                >
                  <p className="font-ui-mono text-xs text-content-caption">{scale.label}</p>
                  <p className={scale.className}>{scale.sample}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-content-rule bg-background p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="font-ui-mono text-xs uppercase tracking-[0.24em] text-content-caption">
                Weight ladder
              </p>
              <div className="mt-4 grid gap-3">
                {fontWeights.map((weight, index) => (
                  <div
                    key={weight.label}
                    className={`grid gap-2 ${
                      index === fontWeights.length - 1 ? '' : 'border-b border-content-rule/70 pb-3'
                    }`}
                  >
                    <p className="font-ui-mono text-xs text-content-caption">{weight.label}</p>
                    <p className={weight.className}>{weight.sample}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-ui-mono text-xs uppercase tracking-[0.24em] text-content-caption">
                Line-height ladder
              </p>
              <div className="mt-4 grid gap-3">
                {lineHeights.map((lineHeight, index) => (
                  <div
                    key={lineHeight.label}
                    className={`grid gap-2 ${
                      index === lineHeights.length - 1 ? '' : 'border-b border-content-rule/70 pb-3'
                    }`}
                  >
                    <p className="font-ui-mono text-xs text-content-caption">{lineHeight.label}</p>
                    <p className={lineHeight.className}>{lineHeight.sample}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection
        id="colors"
        eyebrow="Colors"
        title="Palette aliases expose brand, editorial, and code tones directly in Tailwind."
        description="Each swatch below uses the live Tailwind class derived from the design-system tokens rather than a hardcoded color value."
        tone="colors"
        aside={
          <div className="space-y-4">
            <p className="font-ui-mono text-xs uppercase tracking-[0.24em] text-content-caption">
              Tone families
            </p>
            <div className="grid gap-3">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-content-rule bg-background px-3 py-2">
                <span className="text-sm text-content-copy">Brand accent</span>
                <span className="font-ui-mono text-xs uppercase tracking-[0.2em] text-brand-accent">
                  signal
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-content-rule bg-background px-3 py-2">
                <span className="text-sm text-content-copy">Editorial content</span>
                <span className="font-ui-mono text-xs uppercase tracking-[0.2em] text-content-comment">
                  paper / ink
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-content-rule bg-background px-3 py-2">
                <span className="text-sm text-content-copy">Code treatment</span>
                <span className="font-ui-mono text-xs uppercase tracking-[0.2em] text-content-code-highlight">
                  contrast
                </span>
              </div>
            </div>
          </div>
        }
      >
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="rounded-3xl border border-brand-accent/30 bg-content-paper p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lead text-content-ink">Brand palette</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-content-copy">
                  Accent tones are reserved for signal, navigation cues, and emphatic system marks.
                </p>
              </div>
              <Badge variant="outline">2 accents</Badge>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ColorSwatch label="brand-accent" value="#b5451b" swatchClassName="bg-brand-accent" />
              <ColorSwatch
                label="brand-accent-muted"
                value="#d4794d"
                swatchClassName="bg-brand-accent-muted"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-content-rule bg-background p-6 lg:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lead text-content-ink">Content palette</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-content-copy">
                  Editorial surfaces stay warm and paper-forward, with ink and supporting tones kept
                  visible in a tighter matrix.
                </p>
              </div>
              <Badge variant="outline">8 content tones</Badge>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <ColorSwatch label="content-paper" value="#f5f0e8" swatchClassName="bg-content-paper" />
              <ColorSwatch label="content-cream" value="#ede7d5" swatchClassName="bg-content-cream" />
              <ColorSwatch
                label="content-ink"
                value="#0d0d0d"
                swatchClassName="bg-content-ink"
                textClassName="text-muted-foreground"
              />
              <ColorSwatch label="content-copy" value="#3a3530" swatchClassName="bg-content-copy" />
              <ColorSwatch label="content-quote" value="#2a2520" swatchClassName="bg-content-quote" />
              <ColorSwatch label="content-comment" value="#6a6050" swatchClassName="bg-content-comment" />
              <ColorSwatch label="content-caption" value="#7a6e5e" swatchClassName="bg-content-caption" />
              <ColorSwatch label="content-rule" value="#c8bfa8" swatchClassName="bg-content-rule" />
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-content-rule bg-card p-6 lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-lead text-content-ink">Code palette</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                The code surface uses one shared dark ground with text and highlight states sampled
                inside it.
              </p>
            </div>
            <Badge variant="outline">3 code roles</Badge>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-content-rule bg-background p-4">
                <div className="rounded-md bg-content-code-bg p-4">
                  <code className="font-mono text-sm text-content-code-text">const register = 'editorial'</code>
                </div>
                <p className="mt-4 font-ui-mono text-xs uppercase tracking-[0.2em] text-content-caption">
                  content-code-background
                </p>
              </div>
              <div className="rounded-2xl border border-content-rule bg-background p-4">
                <div className="rounded-md bg-content-code-bg p-4">
                  <code className="font-mono text-sm text-content-code-text">code text sits on the dark surface</code>
                </div>
                <p className="mt-4 font-ui-mono text-xs uppercase tracking-[0.2em] text-content-caption">
                  content-code-text
                </p>
              </div>
              <div className="rounded-2xl border border-content-rule bg-background p-4">
                <div className="rounded-md bg-content-code-bg p-4">
                  <code className="font-mono text-sm text-content-code-highlight">highlighted tokens keep contrast and warmth</code>
                </div>
                <p className="mt-4 font-ui-mono text-xs uppercase tracking-[0.2em] text-content-caption">
                  content-code-highlight
                </p>
              </div>
          </div>
        </div>
      </PageSection>

      <PageSection
        id="ui-primitives"
        eyebrow="UI Primitives"
        title="The installed shadcn primitives remain the first reusable interface layer."
        description="These are the live components from src/components/ui, shown without additional abstraction so the baseline register stays visible."
        tone="primitives"
        aside={
          <div className="space-y-4">
            <p className="font-ui-mono text-xs uppercase tracking-[0.24em] text-content-caption">
              Installed baseline
            </p>
            <div className="flex flex-wrap gap-2">
              {['Button', 'Badge', 'Card', 'Input', 'Separator'].map((label) => (
                <Badge key={label} variant="secondary">
                  {label}
                </Badge>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The page uses these primitives directly so their default spacing, weight, and border
              treatments stay easy to inspect.
            </p>
          </div>
        }
      >
        <div className="rounded-3xl border border-border bg-card">
          {primitiveSpecimens.map((primitive, index) => (
            <div
              key={primitive.title}
              className={`grid gap-5 px-6 py-6 lg:grid-cols-[12rem_1fr] lg:items-start lg:px-8 ${
                index === 0 ? '' : 'border-t border-border'
              }`}
            >
              <div>
                <h3 className="font-ui-sans text-base font-medium text-foreground">
                  {primitive.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {primitive.description}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4 lg:p-5">
                {primitive.preview}
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        id="blocks"
        eyebrow="Blocks"
        title="Every block preview below renders the live Component.tsx output."
        description="The wrappers add labels and context, but the preview content itself is the real block component using either hardcoded sample props or live data where the block already fetches it."
        tone="blocks"
        aside={
          <div className="space-y-4">
            <p className="font-ui-mono text-xs uppercase tracking-[0.24em] text-content-caption">
              Preview rules
            </p>
            <ul className="space-y-2 text-sm leading-relaxed text-content-copy">
              <li>Labels stay lightweight so the block output remains primary.</li>
              <li>No grey boxes, placeholders, or substitute mock cards.</li>
              <li>`data-block-slug` markers remain attached to every preview wrapper.</li>
            </ul>
          </div>
        }
      >
        <div className="grid gap-8">
          <SurfaceStage
            description="These blocks belong to standalone page composition. The order below follows the signed-off page sequence so the surface reads like a plausible destination, not a detached gallery."
            eyebrow="Page Stage"
            surface="page"
            title="Page-level blocks need the room and pacing of a full-page surface."
          >
            <div className="space-y-12 pt-8">
              {pageStageOrder.map((slug, index) => (
                <div
                  key={slug}
                  className={index === 0 ? 'pt-8' : 'border-t border-content-rule/70 pt-12'}
                >
                  <BlockPreview block={blockLookup[slug]}>
                    <div className="overflow-hidden rounded-[1.5rem] border border-content-rule bg-background">
                      {slug === 'archive' ? (
                        <ArchiveBlock {...archiveBlockSample} id={undefined} />
                      ) : (
                        blockPreviews[slug]
                      )}
                    </div>
                  </BlockPreview>
                </div>
              ))}
            </div>
          </SurfaceStage>

          <SurfaceStage
            description="The article stage recreates the reading register locally inside the page so section-level blocks inherit paper, typography, and long-form rhythm without mounting the shared layout component."
            eyebrow="Article Stage"
            surface="article"
            title="Article-surface blocks need editorial hierarchy and paper context."
          >
            <div className="rounded-[1.75rem] border border-content-rule bg-content-paper p-6 md:p-8">
              <div className="content-register">
                <div className="mx-auto max-w-[860px] px-4 pb-12 pt-4 md:px-8 md:pb-16">
                  <header className="border-b border-content-rule pb-8">
                    <p className="hero-eyebrow">Article Surface</p>
                    <h1>Section-level blocks read best when the surrounding article rhythm is intact.</h1>
                    <p className="hero-deck">
                      The preview below keeps the article register local to this route so headings,
                      dividers, and procedural steps feel like part of one long-form read.
                    </p>
                    <p className="byline">Reference preview · long-form article shell</p>
                  </header>

                  <div className="mt-12 space-y-12">
                    {articleStageOrder.map((slug) => (
                      <BlockPreview key={slug} block={blockLookup[slug]}>
                        <div className="mt-6">{blockPreviews[slug]}</div>
                      </BlockPreview>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SurfaceStage>

          <SurfaceStage
            description="Inline blocks interrupt body copy. This stage keeps them inside a narrower prose flow so the previews show where the reading rhythm bends, pauses, or gets reinforced."
            eyebrow="Inline Stage"
            surface="inline"
            title="Inline blocks should feel embedded inside the body flow, not displayed as isolated widgets."
          >
            <div className="rounded-[1.75rem] border border-border bg-background p-6 md:p-8">
              <div className="content-register">
                <div className="mx-auto max-w-[720px] px-0 pb-4 pt-2">
                  <p>
                    Most inline patterns earn their place by interrupting the paragraph for a
                    reason: to warn, demonstrate, quote, or summarize without breaking the whole
                    editorial current.
                  </p>

                  <div className="my-8 py-4">
                    <BlockPreview block={blockLookup.banner}>
                      {blockPreviews.banner}
                    </BlockPreview>
                  </div>

                  <p>
                    Some interruptions are technical rather than rhetorical. Code samples need a
                    deeper contrast shift, while quoted or supporting material should still feel
                    clearly subordinate to the main line of argument.
                  </p>

                  <div className="my-8 py-4">
                    <BlockPreview block={blockLookup.code}>{blockPreviews.code}</BlockPreview>
                  </div>

                  <div className="my-8 py-4">
                    <BlockPreview block={blockLookup.articleCallout}>
                      {blockPreviews.articleCallout}
                    </BlockPreview>
                  </div>

                  <p>
                    When the body needs a side note or a compact comparison, the block should still
                    feel like it belongs to the prose column rather than a separate feature panel.
                  </p>

                  <div className="my-8 py-4">
                    <BlockPreview block={blockLookup.articleAside}>
                      {blockPreviews.articleAside}
                    </BlockPreview>
                  </div>

                  <div className="my-8 py-4">
                    <BlockPreview block={blockLookup.articleStackGrid}>
                      {blockPreviews.articleStackGrid}
                    </BlockPreview>
                  </div>
                </div>
              </div>
            </div>
          </SurfaceStage>
        </div>
      </PageSection>
    </main>
  )
}
