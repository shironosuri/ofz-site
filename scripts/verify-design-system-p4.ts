/**
 * Verification script — Design System Phase 4
 * Run with: pnpm tsx scripts/verify-design-system-p4.ts
 *
 * Requires a running dev server on http://localhost:3000 for HTTP checks.
 * This script performs only read-only checks plus `pnpm tsc --noEmit --incremental false`.
 *
 * Exits with code 1 if any check fails.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const BASE = 'http://localhost:3000'
const PASS = '✓'
const FAIL = '✗'

const SECTION_IDS = ['typography', 'colors', 'ui-primitives', 'blocks'] as const
const JUMP_TARGETS = SECTION_IDS.map((id) => `#${id}`)

const FONT_FAMILY_LABELS = [
  'font-display',
  'font-body',
  'font-mono',
  'font-ui-sans',
  'font-ui-mono',
]

const TYPE_SCALE_LABELS = [
  'text-2xs',
  'text-xs',
  'text-sm',
  'text-base',
  'text-body',
  'text-lead',
  'text-heading',
  'text-hero',
]

const WEIGHT_LABELS = ['font-light', 'font-normal', 'font-medium', 'font-bold']
const LINE_HEIGHT_LABELS = [
  'leading-tight',
  'leading-snug',
  'leading-relaxed',
  'leading-body',
  'leading-code',
  'leading-quote',
]

const COLOR_CLASS_MARKERS = ['bg-brand-accent', 'bg-content-paper', 'bg-content-code-bg']
const UI_PRIMITIVE_LABELS = ['Button', 'Badge', 'Card', 'Input', 'Separator']

const STAGE_ORDER = {
  page: ['content', 'mediaBlock', 'archive', 'cta', 'formBlock'],
  article: ['richTextSection', 'dividerBlock', 'stepSection'],
  inline: ['banner', 'code', 'articleCallout', 'articleAside', 'articleStackGrid'],
} as const

const ALL_BLOCK_SLUGS = [
  ...STAGE_ORDER.page,
  ...STAGE_ORDER.article,
  ...STAGE_ORDER.inline,
]

const SEEDED_ARCHIVE_TITLES = [
  'Digital Horizons: A Glimpse into Tomorrow',
  'Global Gaze: Uncovering Hidden Narratives',
  'Next.js + Payload - running locally in an afternoon.',
]

let failures = 0

function check(label: string, condition: boolean, detail?: string): void {
  if (condition) {
    console.log(`  ${PASS} ${label}`)
    return
  }

  console.log(`  ${FAIL} ${label}${detail ? ` — ${detail}` : ''}`)
  failures++
}

function group(title: string): void {
  console.log(`\n── ${title} ${'─'.repeat(Math.max(1, 60 - title.length))}`)
}

function fileExists(relPath: string): boolean {
  return existsSync(join(ROOT, relPath))
}

function readFile(relPath: string): string {
  return readFileSync(join(ROOT, relPath), 'utf8')
}

function fileContains(relPath: string, pattern: string): boolean {
  if (!fileExists(relPath)) return false
  return readFile(relPath).includes(pattern)
}

function missingFromContent(content: string, tokens: readonly string[]): string[] {
  return tokens.filter((token) => !content.includes(token))
}

function normalizedText(content: string): string {
  return content
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractStageMarkup(content: string, surface: keyof typeof STAGE_ORDER): string | null {
  const markers = Object.keys(STAGE_ORDER).map((key) => ({
    surface: key as keyof typeof STAGE_ORDER,
    index: content.indexOf(`data-preview-surface="${key}"`),
  }))

  const currentMarker = markers.find((marker) => marker.surface === surface)
  if (!currentMarker || currentMarker.index === -1) return null

  const nextIndex = markers
    .filter((marker) => marker.index > currentMarker.index)
    .reduce<number>((smallest, marker) => Math.min(smallest, marker.index), Number.POSITIVE_INFINITY)

  return content.slice(currentMarker.index, Number.isFinite(nextIndex) ? nextIndex : content.length)
}

function findBlockSlugs(content: string): string[] {
  return Array.from(content.matchAll(/data-block-slug="([^"]+)"/g), (match) => match[1] ?? '')
}

function arraysEqual(actual: string[], expected: readonly string[]): boolean {
  return actual.length === expected.length && actual.every((value, index) => value === expected[index])
}

function detailList(values: string[]): string | undefined {
  return values.length > 0 ? values.join(', ') : undefined
}

async function fetchPage(pathname: string): Promise<{ ok: boolean; body?: string; detail?: string }> {
  try {
    const response = await fetch(`${BASE}${pathname}`, { signal: AbortSignal.timeout(5000) })
    const body = await response.text()

    return {
      ok: response.status === 200,
      body,
      detail: `HTTP ${response.status}`,
    }
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : 'Unknown fetch error',
    }
  }
}

group('Script artifact')

check(
  'scripts/verify-design-system-p4.ts exists',
  fileExists('scripts/verify-design-system-p4.ts'),
  'Expected scripts/verify-design-system-p4.ts',
)

group('File checks')

check(
  'page.tsx exports force-dynamic',
  fileContains("src/app/(frontend)/design-system/elements/page.tsx", "export const dynamic = 'force-dynamic'"),
  "Expected export const dynamic = 'force-dynamic'",
)

const missingColorClasses = COLOR_CLASS_MARKERS.filter(
  (token) => !fileContains("src/app/(frontend)/design-system/elements/page.tsx", token),
)

check(
  'page.tsx uses live DS alias classes for palette specimens',
  missingColorClasses.length === 0,
  detailList(missingColorClasses),
)

check(
  'samples.ts exists',
  fileExists('src/app/(frontend)/design-system/elements/samples.ts'),
  'Expected src/app/(frontend)/design-system/elements/samples.ts',
)

group('HTTP checks')

const pageResponse = await fetchPage('/design-system/elements')

check(
  'GET /design-system/elements returns 200',
  pageResponse.ok,
  pageResponse.detail ?? 'Ensure dev server is running on http://localhost:3000',
)

if (pageResponse.body) {
  const body = pageResponse.body
  const bodyText = normalizedText(body)

  check(
    'Response contains a robots meta tag with noindex',
    /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex[^"']*["']/i.test(body),
    'Expected <meta name="robots" content="noindex">',
  )

  const missingSectionIds = SECTION_IDS.filter((id) => !body.includes(`id="${id}"`))
  check(
    'Response contains the four top-level section IDs',
    missingSectionIds.length === 0,
    detailList(missingSectionIds),
  )

  const missingJumpLinks = JUMP_TARGETS.filter((href) => !body.includes(`href="${href}"`))
  check(
    'Response contains jump links to all four sections',
    missingJumpLinks.length === 0,
    detailList(missingJumpLinks),
  )

  const missingFontFamilyLabels = missingFromContent(bodyText, FONT_FAMILY_LABELS)
  check(
    'Typography section contains the five font-family labels',
    missingFontFamilyLabels.length === 0,
    detailList(missingFontFamilyLabels),
  )

  const missingTypeScaleLabels = missingFromContent(bodyText, TYPE_SCALE_LABELS)
  check(
    'Typography section contains the full size-scale labels',
    missingTypeScaleLabels.length === 0,
    detailList(missingTypeScaleLabels),
  )

  const missingWeightLabels = missingFromContent(bodyText, WEIGHT_LABELS)
  check(
    'Typography section contains the built-in weight labels',
    missingWeightLabels.length === 0,
    detailList(missingWeightLabels),
  )

  const missingLineHeightLabels = missingFromContent(bodyText, LINE_HEIGHT_LABELS)
  check(
    'Typography section contains the line-height labels',
    missingLineHeightLabels.length === 0,
    detailList(missingLineHeightLabels),
  )

  const missingPrimitiveLabels = missingFromContent(bodyText, UI_PRIMITIVE_LABELS)
  check(
    'Response contains the UI primitive labels',
    missingPrimitiveLabels.length === 0,
    detailList(missingPrimitiveLabels),
  )

  const missingStageMarkers = (Object.keys(STAGE_ORDER) as Array<keyof typeof STAGE_ORDER>).filter(
    (surface) => !body.includes(`data-preview-surface="${surface}"`),
  )
  check(
    'Response contains the three contextual stage markers',
    missingStageMarkers.length === 0,
    detailList(missingStageMarkers),
  )

  for (const surface of Object.keys(STAGE_ORDER) as Array<keyof typeof STAGE_ORDER>) {
    const stageMarkup = extractStageMarkup(body, surface) ?? ''
    const actualSlugs = findBlockSlugs(stageMarkup)
    const expectedSlugs = STAGE_ORDER[surface]

    check(
      `${surface} stage block order matches the resolved decision`,
      arraysEqual(actualSlugs, expectedSlugs),
      `Expected ${expectedSlugs.join(', ')}; found ${actualSlugs.join(', ') || '(none)'}`,
    )
  }

  for (const slug of ALL_BLOCK_SLUGS) {
    const count = Array.from(body.matchAll(new RegExp(`data-block-slug="${slug}"`, 'g'))).length
    check(
      `${slug} appears exactly once via data-block-slug`,
      count === 1,
      `Found ${String(count)}`,
    )
  }

  const pageStageMarkup = extractStageMarkup(body, 'page') ?? ''
  const mediaBlockInPageStage = Array.from(pageStageMarkup.matchAll(/data-block-slug="mediaBlock"/g)).length === 1
  const mediaBlockGlobalCount = Array.from(body.matchAll(/data-block-slug="mediaBlock"/g)).length
  check(
    'mediaBlock appears once only and inside the page stage',
    mediaBlockInPageStage && mediaBlockGlobalCount === 1,
    `page-stage count ${String(
      Array.from(pageStageMarkup.matchAll(/data-block-slug="mediaBlock"/g)).length,
    )}, global count ${String(mediaBlockGlobalCount)}`,
  )

  check(
    'Archive preview loads at least one known seeded post title',
    SEEDED_ARCHIVE_TITLES.some((title) => bodyText.includes(title)),
    'Expected one of the seeded post titles in the response body',
  )
} else {
  check('Response contains a robots meta tag with noindex', false, 'No HTML response available')
  check('Response contains the four top-level section IDs', false, 'No HTML response available')
  check('Response contains jump links to all four sections', false, 'No HTML response available')
  check('Typography section contains the five font-family labels', false, 'No HTML response available')
  check('Typography section contains the full size-scale labels', false, 'No HTML response available')
  check('Typography section contains the built-in weight labels', false, 'No HTML response available')
  check('Typography section contains the line-height labels', false, 'No HTML response available')
  check('Response contains the UI primitive labels', false, 'No HTML response available')
  check('Response contains the three contextual stage markers', false, 'No HTML response available')

  for (const surface of Object.keys(STAGE_ORDER) as Array<keyof typeof STAGE_ORDER>) {
    check(`${surface} stage block order matches the resolved decision`, false, 'No HTML response available')
  }

  for (const slug of ALL_BLOCK_SLUGS) {
    check(`${slug} appears exactly once via data-block-slug`, false, 'No HTML response available')
  }

  check('mediaBlock appears once only and inside the page stage', false, 'No HTML response available')
  check('Archive preview loads at least one known seeded post title', false, 'No HTML response available')
}

group('Type check')

const tsc = spawnSync('pnpm', ['tsc', '--noEmit', '--incremental', 'false'], {
  cwd: ROOT,
  encoding: 'utf8',
})

const tscDetail =
  tsc.error?.message ||
  tsc.stderr.trim() ||
  tsc.stdout.trim() ||
  `Exited with status ${String(tsc.status)}`

check(
  'pnpm tsc --noEmit --incremental false exits with code 0',
  tsc.status === 0,
  tsc.status === 0 ? undefined : tscDetail,
)

console.log(`\nVerification ${failures === 0 ? 'passed' : 'failed'} with ${String(failures)} issue(s).`)

if (failures > 0) {
  process.exit(1)
}
