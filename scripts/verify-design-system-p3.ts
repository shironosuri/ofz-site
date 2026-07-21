/**
 * Verification script — Design System Phase 3
 * Run with: pnpm tsx scripts/verify-design-system-p3.ts
 *
 * Requires a running dev server on http://localhost:3000 for HTTP checks.
 * All file-system checks run without a server.
 *
 * Exits with code 1 if any check fails.
 *
 * Note: pnpm tsc --noEmit, pnpm generate:types, pnpm generate:importmap,
 * and pnpm vitest run are NOT run by this script — they must be run separately
 * as part of Step 6.
 */

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

type CatalogBlock = {
  slug: string
  dir: string
  surfaces: string[]
  purpose: string
  composesWith: string[]
}

const ROOT = process.cwd()
const PASS = '✓'
const FAIL = '✗'
const BASE = 'http://localhost:3000'
const serverError = 'Ensure dev server is running on http://localhost:3000'

const TYPOGRAPHY_ALIASES = [
  '--font-display:',
  '--font-body:',
  '--font-mono:',
  '--font-ui-sans:',
  '--font-ui-mono:',
  '--text-2xs:',
  '--text-body:',
  '--text-lead:',
  '--text-heading:',
  '--text-hero:',
  '--leading-tight:',
  '--leading-snug:',
  '--leading-relaxed:',
  '--leading-body:',
  '--leading-code:',
  '--leading-quote:',
]

const SECTION_MARKERS = ['id="typography"', 'id="colors"', 'id="ui-primitives"', 'id="blocks"']

let failures = 0

function check(label: string, condition: boolean, detail?: string): void {
  if (condition) {
    console.log(`  ${PASS} ${label}`)
  } else {
    console.log(`  ${FAIL} ${label}${detail ? ` — ${detail}` : ''}`)
    failures++
  }
}

function fileExists(rel: string): boolean {
  return existsSync(join(ROOT, rel))
}

function readFile(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf8')
}

function fileContains(rel: string, pattern: string | RegExp): boolean {
  if (!fileExists(rel)) return false

  const content = readFile(rel)
  return typeof pattern === 'string' ? content.includes(pattern) : pattern.test(content)
}

function readCatalogBlocks(): CatalogBlock[] {
  if (!fileExists('design-system/block-catalog.json')) {
    return []
  }

  try {
    const parsed = JSON.parse(readFile('design-system/block-catalog.json')) as {
      blocks?: unknown
    }

    if (!Array.isArray(parsed.blocks)) {
      return []
    }

    return parsed.blocks.filter((entry): entry is CatalogBlock => {
      if (!entry || typeof entry !== 'object') return false

      const maybeEntry = entry as Partial<CatalogBlock>
      return (
        typeof maybeEntry.slug === 'string' &&
        typeof maybeEntry.dir === 'string' &&
        typeof maybeEntry.purpose === 'string' &&
        Array.isArray(maybeEntry.surfaces) &&
        Array.isArray(maybeEntry.composesWith) &&
        maybeEntry.surfaces.every((surface) => typeof surface === 'string') &&
        maybeEntry.composesWith.every((slug) => typeof slug === 'string')
      )
    })
  } catch {
    return []
  }
}

async function httpCheck(url: string, expectedStatus: number[]): Promise<{ ok: boolean; body?: string }> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const body = await response.text()

    return {
      ok: expectedStatus.includes(response.status),
      body,
    }
  } catch {
    return { ok: false }
  }
}

// ─── FILE CHECKS ─────────────────────────────────────────────────────────────

console.log('\n── Elements page files ──────────────────────────────────────')

check(
  'src/app/(frontend)/design-system/elements/page.tsx contains force-dynamic',
  fileContains("src/app/(frontend)/design-system/elements/page.tsx", "export const dynamic = 'force-dynamic'"),
  'Expected export const dynamic = \'force-dynamic\'',
)

console.log('\n── Typography aliases ───────────────────────────────────────')

for (const alias of TYPOGRAPHY_ALIASES) {
  check(
    `globals.css contains ${alias}`,
    fileContains('src/app/(frontend)/globals.css', alias),
    `Expected ${alias} in src/app/(frontend)/globals.css`,
  )
}

check(
  'AGENTS.md contains font-display',
  fileContains('AGENTS.md', 'font-display'),
  'Expected typography alias table entry in AGENTS.md',
)

console.log('\n── Catalog enrichment ───────────────────────────────────────')

const catalogBlocks = readCatalogBlocks()
const knownSlugs = new Set(catalogBlocks.map((block) => block.slug))

check(
  'design-system/block-catalog.json contains a composesWith field on every entry',
  catalogBlocks.length > 0 && catalogBlocks.every((block) => Object.hasOwn(block, 'composesWith')),
  catalogBlocks.length === 0 ? 'Could not parse design-system/block-catalog.json blocks' : undefined,
)

check(
  'At least one page block has a non-empty composesWith array',
  catalogBlocks.some((block) => block.surfaces.includes('page') && block.composesWith.length > 0),
)

const invalidSlugs: string[] = []
const asymmetricPairs: string[] = []
const crossSurfacePairs: string[] = []
const blocksBySlug = new Map(catalogBlocks.map((block) => [block.slug, block]))

for (const block of catalogBlocks) {
  for (const relatedSlug of block.composesWith) {
    const relatedBlock = blocksBySlug.get(relatedSlug)

    if (!knownSlugs.has(relatedSlug) || !relatedBlock) {
      invalidSlugs.push(`${block.slug} -> ${relatedSlug}`)
      continue
    }

    if (!relatedBlock.composesWith.includes(block.slug)) {
      asymmetricPairs.push(`${block.slug} -> ${relatedSlug}`)
    }

    if (!block.surfaces.some((surface) => relatedBlock.surfaces.includes(surface))) {
      crossSurfacePairs.push(`${block.slug} -> ${relatedSlug}`)
    }
  }
}

check(
  'All composesWith values are known block slugs',
  invalidSlugs.length === 0,
  invalidSlugs.length > 0 ? invalidSlugs.join(', ') : undefined,
)

check(
  'All composesWith relationships are symmetric',
  asymmetricPairs.length === 0,
  asymmetricPairs.length > 0 ? asymmetricPairs.join(', ') : undefined,
)

check(
  'All composesWith relationships are same-surface',
  crossSurfacePairs.length === 0,
  crossSurfacePairs.length > 0 ? crossSurfacePairs.join(', ') : undefined,
)

console.log('\n── ds:index ────────────────────────────────────────────────')

const dsIndex = spawnSync('pnpm', ['ds:index'], {
  cwd: ROOT,
  encoding: 'utf8',
})

const dsIndexDetail =
  dsIndex.error?.message ||
  dsIndex.stderr.trim() ||
  dsIndex.stdout.trim() ||
  `Exited with status ${String(dsIndex.status)}`

check('pnpm ds:index exits with code 0', dsIndex.status === 0, dsIndex.status === 0 ? undefined : dsIndexDetail)

console.log('\n── Composition prompt ───────────────────────────────────────')

check(
  'PROMPT_PAGE_COMPOSITION.md exists',
  fileExists('.scrapboard/design-system-prompt-files/PROMPT_PAGE_COMPOSITION.md'),
)

check(
  'PROMPT_PAGE_COMPOSITION.md contains block-catalog.json',
  fileContains('.scrapboard/design-system-prompt-files/PROMPT_PAGE_COMPOSITION.md', 'block-catalog.json'),
)

check(
  'PROMPT_PAGE_COMPOSITION.md contains SUMMARY.md',
  fileContains('.scrapboard/design-system-prompt-files/PROMPT_PAGE_COMPOSITION.md', 'SUMMARY.md'),
)

check(
  'PROMPT_PAGE_COMPOSITION.md contains AGENTS.md',
  fileContains('.scrapboard/design-system-prompt-files/PROMPT_PAGE_COMPOSITION.md', 'AGENTS.md'),
)

check(
  'PROMPT_PAGE_COMPOSITION.md contains existing block',
  fileContains('.scrapboard/design-system-prompt-files/PROMPT_PAGE_COMPOSITION.md', 'existing block'),
)

check(
  'PROMPT_PAGE_COMPOSITION.md contains shadcn or installed packages',
  fileContains('.scrapboard/design-system-prompt-files/PROMPT_PAGE_COMPOSITION.md', 'shadcn') ||
    fileContains('.scrapboard/design-system-prompt-files/PROMPT_PAGE_COMPOSITION.md', 'installed packages'),
)

check(
  'PROMPT_PAGE_COMPOSITION.md contains free-form',
  fileContains('.scrapboard/design-system-prompt-files/PROMPT_PAGE_COMPOSITION.md', 'free-form'),
)

check(
  'PROMPT_PAGE_COMPOSITION.md contains Structured',
  fileContains('.scrapboard/design-system-prompt-files/PROMPT_PAGE_COMPOSITION.md', 'Structured'),
)

check(
  'PROMPT_PAGE_COMPOSITION.md contains Component',
  fileContains('.scrapboard/design-system-prompt-files/PROMPT_PAGE_COMPOSITION.md', 'Component'),
)

check(
  'PROMPT_PAGE_COMPOSITION.md contains — "',
  fileContains('.scrapboard/design-system-prompt-files/PROMPT_PAGE_COMPOSITION.md', '— "'),
)

check(
  'PROMPT_PAGE_COMPOSITION.md contains CMS',
  fileContains('.scrapboard/design-system-prompt-files/PROMPT_PAGE_COMPOSITION.md', 'CMS'),
)

check(
  'PROMPT_PAGE_COMPOSITION.md contains Prompt 4',
  fileContains('.scrapboard/design-system-prompt-files/PROMPT_PAGE_COMPOSITION.md', 'Prompt 4'),
)

check(
  'DEV_PROMPT_SEQUENCE.md contains PROMPT_PAGE_COMPOSITION',
  fileContains('.scrapboard/design-system-prompt-files/DEV_PROMPT_SEQUENCE.md', 'PROMPT_PAGE_COMPOSITION'),
)

check(
  'DEV_PROMPT_SEQUENCE.md contains Page composition track',
  fileContains('.scrapboard/design-system-prompt-files/DEV_PROMPT_SEQUENCE.md', 'Page composition track'),
)

// ─── HTTP CHECKS ─────────────────────────────────────────────────────────────

console.log('\n── HTTP checks (requires running dev server) ────────────────')

const elementsResponse = await httpCheck(`${BASE}/design-system/elements`, [200])

check('GET /design-system/elements returns 200', elementsResponse.ok, elementsResponse.ok ? undefined : serverError)

check(
  'GET /design-system/elements response contains noindex',
  elementsResponse.ok && Boolean(elementsResponse.body?.includes('noindex')),
  elementsResponse.ok ? 'Expected noindex in response body' : serverError,
)

for (const marker of SECTION_MARKERS) {
  check(
    `GET /design-system/elements response contains ${marker}`,
    elementsResponse.ok && Boolean(elementsResponse.body?.includes(marker)),
    elementsResponse.ok ? `Missing ${marker}` : serverError,
  )
}

for (const slug of catalogBlocks.map((block) => block.slug)) {
  const marker = `data-block-slug="${slug}"`

  check(
    `GET /design-system/elements response contains ${marker}`,
    elementsResponse.ok && Boolean(elementsResponse.body?.includes(marker)),
    elementsResponse.ok ? `Missing ${marker}` : serverError,
  )
}

// ─── SUMMARY ────────────────────────────────────────────────────────────────

console.log('\n─────────────────────────────────────────────────────────────')

if (failures === 0) {
  console.log(`\n${PASS} All checks passed. Design System Phase 3 verification complete.\n`)
  process.exit(0)
} else {
  console.log(
    `\n${FAIL} ${failures} check${failures === 1 ? '' : 's'} failed. Resolve before marking step complete.\n`,
  )
  process.exit(1)
}
