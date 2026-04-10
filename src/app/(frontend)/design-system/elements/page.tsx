import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import blockCatalog from '../../../../../design-system/block-catalog.json'

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
import { ContentRegisterLayout } from '@/components/ContentRegister/Layout'
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

function PageSection({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="border-b border-border py-16" id={id}>
      <div className="container">
        <div className="mb-8 max-w-3xl">
          <p className="font-ui-mono text-2xs uppercase tracking-widest text-content-caption">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-display text-heading leading-snug text-content-ink">
            {title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </div>
    </section>
  )
}

function PreviewCard({
  slug,
  purpose,
  surfaces,
  children,
  tone = 'default',
}: {
  slug: string
  purpose: string
  surfaces: string[]
  children: ReactNode
  tone?: 'default' | 'editorial'
}) {
  return (
    <article
      className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm"
      data-block-slug={slug}
    >
      <div className="border-b border-border bg-muted/40 px-4 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-ui-mono text-2xs uppercase tracking-widest text-content-caption">
            {slug}
          </p>
          {surfaces.map((surface) => (
            <Badge key={`${slug}-${surface}`} variant="outline">
              {surface}
            </Badge>
          ))}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{purpose}</p>
      </div>
      <div className={tone === 'editorial' ? 'bg-content-paper' : 'bg-background'}>{children}</div>
    </article>
  )
}

function TypographySpecimen({
  label,
  className,
  sample,
}: {
  label: string
  className: string
  sample: ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <p className="font-ui-mono text-2xs uppercase tracking-widest text-content-caption">
        {label}
      </p>
      <div className={`mt-4 ${className}`}>{sample}</div>
    </div>
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
    <div className="rounded-lg border border-border bg-card p-4">
      <div className={`h-20 rounded-md border border-border ${swatchClassName}`} />
      <div className="mt-4">
        <p className="font-ui-mono text-xs text-content-caption">{label}</p>
        <p className={`mt-1 text-sm ${textClassName}`}>{value}</p>
      </div>
    </div>
  )
}

export default function DesignSystemElementsPage() {
  const blocks = blockCatalog.blocks as CatalogBlock[]

  const blockPreviews: Record<string, { node: ReactNode; tone?: 'default' | 'editorial' }> = {
    archive: {
      node: <ArchiveBlock {...archiveBlockSample} id={undefined} />,
    },
    articleAside: {
      tone: 'editorial',
      node: (
        <ContentRegisterLayout>
          <div className="pt-4">
            <ArticleAsideBlock {...articleAsideSample} />
          </div>
        </ContentRegisterLayout>
      ),
    },
    articleCallout: {
      tone: 'editorial',
      node: (
        <ContentRegisterLayout>
          <div className="pt-4">
            <ArticleCalloutBlock {...articleCalloutSample} />
          </div>
        </ContentRegisterLayout>
      ),
    },
    articleStackGrid: {
      tone: 'editorial',
      node: (
        <ContentRegisterLayout>
          <div className="pt-4">
            <ArticleStackGridBlock {...articleStackGridSample} />
          </div>
        </ContentRegisterLayout>
      ),
    },
    banner: {
      tone: 'editorial',
      node: (
        <ContentRegisterLayout>
          <div className="pt-4">
            <BannerBlock {...bannerSample} />
          </div>
        </ContentRegisterLayout>
      ),
    },
    cta: {
      node: <CallToActionBlock {...callToActionSample} />,
    },
    code: {
      tone: 'editorial',
      node: (
        <ContentRegisterLayout>
          <div className="pt-4">
            <CodeBlock {...codeBlockSample} />
          </div>
        </ContentRegisterLayout>
      ),
    },
    content: {
      node: <ContentBlock {...contentBlockSample} />,
    },
    dividerBlock: {
      tone: 'editorial',
      node: (
        <ContentRegisterLayout>
          <div className="pt-4">
            <DividerBlockComponent block={dividerBlockSample} />
          </div>
        </ContentRegisterLayout>
      ),
    },
    formBlock: {
      node: <FormBlock {...formBlockSample} />,
    },
    mediaBlock: {
      tone: 'editorial',
      node: (
        <ContentRegisterLayout>
          <div className="pt-4">
            <MediaBlock {...mediaBlockSample} enableGutter={false} />
          </div>
        </ContentRegisterLayout>
      ),
    },
    richTextSection: {
      tone: 'editorial',
      node: (
        <ContentRegisterLayout>
          <div className="pt-4">
            <RichTextSectionComponent block={richTextSectionSample} />
          </div>
        </ContentRegisterLayout>
      ),
    },
    stepSection: {
      tone: 'editorial',
      node: (
        <ContentRegisterLayout>
          <div className="pt-4">
            <StepSectionComponent block={stepSectionSample} />
          </div>
        </ContentRegisterLayout>
      ),
    },
  }

  return (
    <main className="bg-background pb-24 text-foreground">
      <div className="border-b border-border bg-card">
        <div className="container py-16">
          <p className="font-ui-mono text-2xs uppercase tracking-widest text-content-caption">
            Design System
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-hero leading-tight text-content-ink">
            Elements reference for typography, palette, primitives, and live blocks.
          </h1>
          <p className="mt-4 max-w-3xl text-body leading-body text-content-copy">
            This page is intentionally dynamic and public-but-noindex. It exists to show the actual
            output of the current design system rather than mocked approximations.
          </p>
        </div>
      </div>

      <PageSection
        id="typography"
        eyebrow="Typography"
        title="Type is mapped to live utility aliases and Tailwind built-ins."
        description="The specimens below show the live family aliases, the full scale from text-2xs through text-hero, built-in weight classes, and all six line-height utilities."
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <TypographySpecimen
            label="font-display"
            className="font-display text-heading leading-tight text-content-ink"
            sample="The sentence should feel cut, weighted, and deliberate."
          />
          <TypographySpecimen
            label="font-body"
            className="font-body text-body leading-body text-content-copy"
            sample="Long-form explanation needs to stay clear, warm, and easy to track across extended reading."
          />
          <TypographySpecimen
            label="font-mono"
            className="font-mono text-sm leading-code text-content-comment"
            sample="pnpm tsc --noEmit  status: clean  target: local"
          />
          <TypographySpecimen
            label="font-ui-sans"
            className="font-ui-sans text-base leading-snug"
            sample="Interface language should stay compact and frictionless."
          />
          <TypographySpecimen
            label="font-ui-mono"
            className="font-ui-mono text-xs leading-code"
            sample="route=/design-system/elements  robots=noindex  mode=force-dynamic"
          />
        </div>

        <div className="mt-8 grid gap-4 rounded-lg border border-border bg-card p-6">
          <p className="font-ui-mono text-2xs uppercase tracking-widest text-content-caption">
            Type scale
          </p>
          <div className="grid gap-4">
            <div className="grid gap-2 md:grid-cols-[8rem_1fr]">
              <p className="font-ui-mono text-xs text-content-caption">text-2xs</p>
              <p className="text-2xs">Compact metadata and system labels.</p>
            </div>
            <div className="grid gap-2 md:grid-cols-[8rem_1fr]">
              <p className="font-ui-mono text-xs text-content-caption">text-xs</p>
              <p className="text-xs">Small but still legible supporting interface copy.</p>
            </div>
            <div className="grid gap-2 md:grid-cols-[8rem_1fr]">
              <p className="font-ui-mono text-xs text-content-caption">text-sm</p>
              <p className="text-sm">Helper text, captions, and dense UI description.</p>
            </div>
            <div className="grid gap-2 md:grid-cols-[8rem_1fr]">
              <p className="font-ui-mono text-xs text-content-caption">text-base</p>
              <p className="text-base">Default interface copy and standard body text.</p>
            </div>
            <div className="grid gap-2 md:grid-cols-[8rem_1fr]">
              <p className="font-ui-mono text-xs text-content-caption">text-body</p>
              <p className="text-body leading-body">Editorial body copy with comfortable reading rhythm.</p>
            </div>
            <div className="grid gap-2 md:grid-cols-[8rem_1fr]">
              <p className="font-ui-mono text-xs text-content-caption">text-lead</p>
              <p className="text-lead leading-relaxed">Lead paragraphs that need more air and emphasis.</p>
            </div>
            <div className="grid gap-2 md:grid-cols-[8rem_1fr]">
              <p className="font-ui-mono text-xs text-content-caption">text-heading</p>
              <p className="font-display text-heading leading-snug">Section headings with visible editorial lift.</p>
            </div>
            <div className="grid gap-2 md:grid-cols-[8rem_1fr]">
              <p className="font-ui-mono text-xs text-content-caption">text-hero</p>
              <p className="font-display text-hero leading-tight">A marquee line that sets the page’s register.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <TypographySpecimen
            label="font weights"
            className="grid gap-3"
            sample={
              <>
                <p className="font-light">font-light keeps emphasis understated.</p>
                <p className="font-normal">font-normal holds the baseline reading voice.</p>
                <p className="font-medium">font-medium gives UI labels and subheads extra pull.</p>
                <p className="font-bold">font-bold lands the strongest statements and headings.</p>
              </>
            }
          />
          <TypographySpecimen
            label="line heights"
            className="grid gap-4"
            sample={
              <>
                <p className="leading-tight">leading-tight compresses headline lines for sharp, stacked display copy.</p>
                <p className="leading-snug">leading-snug keeps headings compact without becoming cramped.</p>
                <p className="leading-relaxed">leading-relaxed opens introductory or reflective copy.</p>
                <p className="leading-body">leading-body sets the default editorial reading rhythm.</p>
                <p className="font-mono text-sm leading-code">leading-code supports dense monospace snippets without collapsing.</p>
                <p className="font-display text-lead leading-quote">leading-quote gives emphasized quotations room to breathe.</p>
              </>
            }
          />
        </div>
      </PageSection>

      <PageSection
        id="colors"
        eyebrow="Colors"
        title="Palette aliases expose brand, editorial, and code tones directly in Tailwind."
        description="Each swatch below uses the live Tailwind class derived from the design-system tokens rather than a hardcoded color value."
      >
        <div className="grid gap-8">
          <div>
            <h3 className="font-display text-lead text-content-ink">Brand palette</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <ColorSwatch label="brand-accent" value="#b5451b" swatchClassName="bg-brand-accent" />
              <ColorSwatch
                label="brand-accent-muted"
                value="#d4794d"
                swatchClassName="bg-brand-accent-muted"
              />
            </div>
          </div>

          <div>
            <h3 className="font-display text-lead text-content-ink">Content palette</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

          <div>
            <h3 className="font-display text-lead text-content-ink">Code palette</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="rounded-md bg-content-code-bg p-4">
                  <code className="font-mono text-sm text-content-code-text">const register = 'editorial'</code>
                </div>
                <p className="mt-4 font-ui-mono text-xs text-content-caption">content-code-background</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="rounded-md bg-content-code-bg p-4">
                  <code className="font-mono text-sm text-content-code-text">code text sits on the dark surface</code>
                </div>
                <p className="mt-4 font-ui-mono text-xs text-content-caption">content-code-text</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="rounded-md bg-content-code-bg p-4">
                  <code className="font-mono text-sm text-content-code-highlight">highlighted tokens keep contrast and warmth</code>
                </div>
                <p className="mt-4 font-ui-mono text-xs text-content-caption">content-code-highlight</p>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      <PageSection
        id="ui-primitives"
        eyebrow="UI Primitives"
        title="The installed shadcn primitives remain the first reusable interface layer."
        description="These are the live components from src/components/ui, shown without additional abstraction so the baseline register stays visible."
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Button</CardTitle>
              <CardDescription>Shared action states and emphasis levels.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Badge</CardTitle>
              <CardDescription>Compact status and metadata treatment.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card</CardTitle>
              <CardDescription>Container primitive with header, body, and footer slots.</CardDescription>
            </CardHeader>
            <CardContent>
              <Card className="shadow-none">
                <CardHeader>
                  <CardTitle>Reference card</CardTitle>
                  <CardDescription>Use this when content needs a bounded semantic surface.</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button size="sm" variant="outline">
                    Inspect
                  </Button>
                </CardFooter>
              </Card>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
              <CardDescription>Shared text-field baseline.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Input defaultValue="Editorial systems stay legible under load." type="text" />
              <Input defaultValue="hello@onefromzero.dev" type="email" />
            </CardContent>
          </Card>

          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Separator</CardTitle>
              <CardDescription>Horizontal and vertical division without inventing bespoke rules.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <p className="text-sm text-muted-foreground">Horizontal</p>
                <Separator />
              </div>
              <div className="flex h-16 items-center gap-4">
                <span className="text-sm text-muted-foreground">Left</span>
                <Separator orientation="vertical" />
                <span className="text-sm text-muted-foreground">Right</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      <PageSection
        id="blocks"
        eyebrow="Blocks"
        title="Every block preview below renders the live Component.tsx output."
        description="The wrappers add labels and context, but the preview content itself is the real block component using either hardcoded sample props or live data where the block already fetches it."
      >
        <div className="grid gap-8">
          {blocks.map((block) => {
            const preview = blockPreviews[block.slug]

            if (!preview) return null

            return (
              <PreviewCard
                key={block.slug}
                purpose={block.purpose}
                slug={block.slug}
                surfaces={block.surfaces}
                tone={preview.tone}
              >
                {preview.node}
              </PreviewCard>
            )
          })}
        </div>
      </PageSection>
    </main>
  )
}
