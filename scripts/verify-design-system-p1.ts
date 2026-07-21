/**
 * Verification script — Design System Phase 1
 * Run with: pnpm tsx scripts/verify-design-system-p1.ts
 *
 * Requires a running dev server on http://localhost:3000 for HTTP checks.
 * All file-system checks run without a server.
 *
 * Exits with code 1 if any check fails.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const ROOT = process.cwd()
const PASS = '✓'
const FAIL = '✗'

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

function fileContains(rel: string, pattern: string | RegExp): boolean {
  if (!fileExists(rel)) return false
  const content = readFileSync(join(ROOT, rel), 'utf-8')
  return typeof pattern === 'string' ? content.includes(pattern) : pattern.test(content)
}

function fileNotContains(rel: string, pattern: string | RegExp): boolean {
  if (!fileExists(rel)) return true // file not existing means it can't contain the pattern
  const content = readFileSync(join(ROOT, rel), 'utf-8')
  return typeof pattern === 'string' ? !content.includes(pattern) : !pattern.test(content)
}

function dirExists(rel: string): boolean {
  const full = join(ROOT, rel)
  return existsSync(full) && statSync(full).isDirectory()
}

function dirNotExists(rel: string): boolean {
  return !existsSync(join(ROOT, rel))
}

async function httpCheck(url: string, expectedStatus: number[]): Promise<boolean> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    return expectedStatus.includes(res.status)
  } catch {
    return false
  }
}

// ─── TOKEN LAYER ────────────────────────────────────────────────────────────

console.log('\n── Token layer ──────────────────────────────────────────────')

check(
  'src/styles/tokens.css exists',
  fileExists('src/styles/tokens.css'),
)

check(
  'src/styles/tokens.css is non-empty',
  fileExists('src/styles/tokens.css') &&
    readFileSync(join(ROOT, 'src/styles/tokens.css'), 'utf-8').trim().length > 0,
)

check(
  'globals.css imports tokens.css',
  fileContains('src/app/(frontend)/globals.css', 'tokens.css'),
  'Expected @import referencing tokens.css',
)

check(
  'globals.css import order: tw-animate-css before tokens.css',
  (() => {
    if (!fileExists('src/app/(frontend)/globals.css')) return false
    const content = readFileSync(join(ROOT, 'src/app/(frontend)/globals.css'), 'utf-8')
    const animateIdx = content.indexOf('tw-animate-css')
    const tokensIdx = content.indexOf('tokens.css')
    return animateIdx !== -1 && tokensIdx !== -1 && animateIdx < tokensIdx
  })(),
  'tokens.css must be imported AFTER tw-animate-css — check import order in globals.css',
)

check(
  'content-register.css imports tokens.css',
  fileContains('src/components/ContentRegister/content-register.css', 'tokens.css'),
  'Expected @import referencing tokens.css',
)

check(
  'content-register.css contains no bare hex values',
  fileNotContains(
    'src/components/ContentRegister/content-register.css',
    /#[0-9a-fA-F]{3,6}\b/,
  ),
  'Found hardcoded hex value — replace with --ds-* token',
)

check(
  'content-register.css contains no rgba() color literals',
  fileNotContains(
    'src/components/ContentRegister/content-register.css',
    /rgba?\s*\(/,
  ),
  'Found rgba()/rgb() color literal — replace with --ds-* token',
)

check(
  'tokens.css contains --ds-color-',
  fileContains('src/styles/tokens.css', '--ds-color-'),
)

check(
  'tokens.css contains --ds-font-',
  fileContains('src/styles/tokens.css', '--ds-font-'),
)

check(
  'tokens.css contains --ds-spacing-',
  fileContains('src/styles/tokens.css', '--ds-spacing-'),
)

// ─── COMPONENT REGISTRY ─────────────────────────────────────────────────────

console.log('\n── Component registry ───────────────────────────────────────')

check(
  'registry.json exists at project root',
  fileExists('registry.json'),
)

check(
  'registry.json contains $schema field',
  fileContains('registry.json', '$schema'),
  'Expected $schema pointing to shadcn registry JSON schema',
)

check(
  'registry.json contains name field',
  fileContains('registry.json', '"name"'),
  'Expected "name" field in registry.json',
)

check(
  'registry.json contains homepage field',
  fileContains('registry.json', '"homepage"'),
  'Expected "homepage" field in registry.json',
)

if (fileExists('registry.json')) {
  try {
    const registry = JSON.parse(readFileSync(join(ROOT, 'registry.json'), 'utf-8'))
    check(
      'registry.json.items is an empty array',
      Array.isArray(registry.items) && registry.items.length === 0,
      `Expected items: [], found ${JSON.stringify(registry.items?.slice(0, 3))}`,
    )
  } catch {
    check('registry.json is valid JSON', false, 'Parse error')
  }
}

check(
  'components.json exists at project root',
  fileExists('components.json'),
)

const shadcnComponents = ['dialog', 'sheet', 'badge', 'separator', 'avatar']
for (const component of shadcnComponents) {
  check(
    `src/components/ui/${component}.tsx exists`,
    fileExists(`src/components/ui/${component}.tsx`),
  )
}

// ─── BLOCK DIRECTORY ────────────────────────────────────────────────────────

console.log('\n── Block directory ──────────────────────────────────────────')

check(
  'src/blocks/ArticleBlocks/ does NOT exist',
  dirNotExists('src/blocks/ArticleBlocks'),
  'ArticleBlocks subdirectory should have been flattened',
)

check(
  'src/blocks/RelatedPosts/ does NOT exist',
  dirNotExists('src/blocks/RelatedPosts'),
  'RelatedPosts should have been moved to src/components/RelatedPosts/',
)

check(
  'src/components/RelatedPosts/Component.tsx exists',
  fileExists('src/components/RelatedPosts/Component.tsx'),
  'RelatedPosts was not found at its new location',
)

const movedBlocks = ['RichTextSection', 'StepSection', 'DividerBlock']
for (const block of movedBlocks) {
  check(
    `src/blocks/${block}/config.ts exists`,
    fileExists(`src/blocks/${block}/config.ts`),
  )
  check(
    `src/blocks/${block}/Component.tsx exists`,
    fileExists(`src/blocks/${block}/Component.tsx`),
  )
}

check(
  'src/blocks/sharedBodyEditor.ts exists at blocks root',
  fileExists('src/blocks/sharedBodyEditor.ts'),
)

check(
  'RenderArticleBlocks.tsx has no ArticleBlocks/ import paths',
  fileNotContains('src/blocks/RenderArticleBlocks.tsx', 'ArticleBlocks/'),
  'Old ArticleBlocks/ import path found — update to flat @/blocks/ paths',
)

check(
  'Posts/index.ts has no ArticleBlocks/ import paths',
  fileNotContains('src/collections/Posts/index.ts', 'ArticleBlocks/'),
  'Old ArticleBlocks/ import path found — update to flat ../../blocks/ paths',
)

check(
  'sharedBodyEditor.ts has no ../../blocks/ relative import paths',
  fileNotContains('src/blocks/sharedBodyEditor.ts', '../../blocks/'),
  'Old relative import found — replace with @/blocks/ aliases',
)

// Two-file rule: a block directory is defined as one that contains config.ts.
// Non-block helpers (RelatedPosts/) and root files are excluded.
const blocksDir = join(ROOT, 'src/blocks')
const nonBlockFiles = new Set([
  'RenderBlocks.tsx',
  'RenderArticleBlocks.tsx',
  'sharedBodyEditor.ts',
  'RelatedPosts', // Pre-Step-3 guard only — should not exist here post-Step-3 (moved to src/components/)
])

if (dirExists('src/blocks')) {
  const entries = readdirSync(blocksDir)
  const blockDirs = entries.filter((entry) => {
    const full = join(blocksDir, entry)
    return statSync(full).isDirectory() && !nonBlockFiles.has(entry)
  })

  let twoFileViolations: string[] = []
  for (const dir of blockDirs) {
    const hasConfig = fileExists(`src/blocks/${dir}/config.ts`)
    const hasComponent = fileExists(`src/blocks/${dir}/Component.tsx`)
    if (!hasConfig || !hasComponent) {
      twoFileViolations.push(`${dir} (config: ${hasConfig}, Component: ${hasComponent})`)
    }
  }

  check(
    'All block dirs contain config.ts + Component.tsx',
    twoFileViolations.length === 0,
    twoFileViolations.length > 0 ? `Violations: ${twoFileViolations.join(', ')}` : undefined,
  )
}

// ─── RENDERER ALIGNMENT ─────────────────────────────────────────────────────

console.log('\n── Renderer alignment ───────────────────────────────────────')

check(
  'RenderArticleBlocks.tsx uses blockComponents object map',
  fileContains('src/blocks/RenderArticleBlocks.tsx', 'blockComponents'),
  'Expected object-map pattern matching RenderBlocks.tsx',
)

check(
  'RenderArticleBlocks.tsx has no if (blockType ==) chains',
  fileNotContains('src/blocks/RenderArticleBlocks.tsx', "if (blockType ==="),
  'if-chain pattern should be replaced with object map',
)

check(
  'RenderArticleBlocks.tsx contains console.warn for unknown blockType',
  fileContains('src/blocks/RenderArticleBlocks.tsx', 'console.warn'),
  'Expected console.warn fallback for unrecognised blockType',
)

check(
  'RenderBlocks.tsx contains console.warn for unknown blockType',
  fileContains('src/blocks/RenderBlocks.tsx', 'console.warn'),
  'Expected console.warn fallback for unrecognised blockType (back-ported in Step 4)',
)

// ─── AGENT GOVERNANCE ───────────────────────────────────────────────────────

console.log('\n── Agent governance ─────────────────────────────────────────')

check(
  'design-system/SUMMARY.md exists',
  fileExists('design-system/SUMMARY.md'),
)

check(
  'design-system/SUMMARY.md contains ## Token section',
  fileContains('design-system/SUMMARY.md', '## Token'),
  'Expected a "## Token" heading — SUMMARY.md may be a stub',
)

check(
  'design-system/SUMMARY.md contains ## Block section',
  fileContains('design-system/SUMMARY.md', '## Block'),
  'Expected a "## Block" heading — SUMMARY.md may be a stub',
)

check(
  'design-system/SUMMARY.md contains UI Primitives section',
  fileContains('design-system/SUMMARY.md', 'UI Primitive') || fileContains('design-system/SUMMARY.md', '## UI'),
  'Expected a UI Primitives section — SUMMARY.md may be incomplete',
)

check(
  'design-system/SUMMARY.md contains typography section',
  fileContains('design-system/SUMMARY.md', 'Typography') || fileContains('design-system/SUMMARY.md', 'typography'),
  'Expected a typography section — SUMMARY.md may be incomplete',
)

check(
  'design-system/SUMMARY.md contains spacing section',
  fileContains('design-system/SUMMARY.md', 'Spacing') || fileContains('design-system/SUMMARY.md', 'spacing'),
  'Expected a spacing section — SUMMARY.md may be incomplete',
)

check(
  'design-system/SUMMARY.md contains block creation checklist',
  fileContains('design-system/SUMMARY.md', 'checklist') || fileContains('design-system/SUMMARY.md', 'Checklist'),
  'Expected a block creation checklist — SUMMARY.md may be incomplete',
)

check(
  'design-system/component-index.json exists',
  fileExists('design-system/component-index.json'),
)

if (fileExists('design-system/component-index.json')) {
  try {
    const index = JSON.parse(
      readFileSync(join(ROOT, 'design-system/component-index.json'), 'utf-8'),
    )
    check(
      'component-index.json has ui array with entries',
      Array.isArray(index.ui) && index.ui.length > 0,
      `Found ${index.ui?.length ?? 0} ui entries`,
    )
    check(
      'component-index.json has blocks array with entries',
      Array.isArray(index.blocks) && index.blocks.length > 0,
      `Found ${index.blocks?.length ?? 0} block entries`,
    )

    if (Array.isArray(index.blocks) && index.blocks.length > 0) {
      const requiredFields = ['slug', 'dir', 'type', 'hasConfig', 'hasComponent']
      const missingFields = index.blocks
        .flatMap((entry: Record<string, unknown>, i: number) =>
          requiredFields
            .filter((f) => !(f in entry))
            .map((f) => `blocks[${i}] (${entry.slug ?? '?'}) missing "${f}"`),
        )
      check(
        'All block entries have required fields (slug, dir, type, hasConfig, hasComponent)',
        missingFields.length === 0,
        missingFields.length > 0 ? missingFields.join(', ') : undefined,
      )

      const falseConfigOrComponent = index.blocks
        .filter((entry: Record<string, unknown>) => entry.hasConfig !== true || entry.hasComponent !== true)
        .map((entry: Record<string, unknown>) => `${entry.slug ?? entry.dir} (hasConfig: ${entry.hasConfig}, hasComponent: ${entry.hasComponent})`)
      check(
        'All block entries have hasConfig: true and hasComponent: true',
        falseConfigOrComponent.length === 0,
        falseConfigOrComponent.length > 0 ? `Failing entries: ${falseConfigOrComponent.join(', ')}` : undefined,
      )

      // Spot-check known slug mappings
      const knownSlugs: Record<string, string> = {
        CallToAction: 'cta',
        ArchiveBlock: 'archive',
        Form: 'formBlock',
      }
      for (const [dir, expectedSlug] of Object.entries(knownSlugs)) {
        const entry = index.blocks.find((b: Record<string, unknown>) => b.dir === dir)
        if (entry) {
          check(
            `component-index.json "${dir}" has slug "${expectedSlug}"`,
            entry.slug === expectedSlug,
            `Expected slug "${expectedSlug}", got "${entry.slug}"`,
          )
        }
      }

      // Spot-check known slug→type mappings
      const knownTypes: Record<string, string> = {
        cta: 'page',
        richTextSection: 'article',
        articleCallout: 'inline',
        mediaBlock: 'both',
      }
      for (const [slug, expectedType] of Object.entries(knownTypes)) {
        const entry = index.blocks.find((b: Record<string, unknown>) => b.slug === slug)
        if (entry) {
          check(
            `component-index.json block "${slug}" has type "${expectedType}"`,
            entry.type === expectedType,
            `Expected type "${expectedType}", got "${entry.type}"`,
          )
        }
      }
    }
  } catch {
    check('component-index.json is valid JSON', false, 'Parse error')
  }
}

check(
  'AGENTS.md contains Design System section',
  fileContains('AGENTS.md', '## Design System'),
)

check(
  'AGENTS.md references src/styles/tokens.css',
  fileContains('AGENTS.md', 'src/styles/tokens.css'),
  'Design System section must reference the token file by path',
)

check(
  'AGENTS.md references design-system/component-index.json',
  fileContains('AGENTS.md', 'design-system/component-index.json'),
  'Design System section must reference the component index by path',
)

check(
  'AGENTS.md references design-system/SUMMARY.md',
  fileContains('AGENTS.md', 'design-system/SUMMARY.md'),
  'Design System section must reference SUMMARY.md by path',
)

// Heuristic checks for each of the 8 required rule categories
// These check for a key phrase per rule — not exact wording, which may vary
const agentsRuleChecks: Array<[string, string]> = [
  ['no raw colour values rule', '--ds-'],           // rule 1: must reference --ds-* token prefix
  ['two-file block rule (config.ts)', 'config.ts'], // rule 4: config.ts + Component.tsx
  ['slug alignment rule', 'blockComponents'],       // rule 5: slug must match renderer key
  ['getPayload exception', 'ArchiveBlock'],         // rule 6: documented exception
  ['ds:index run rule', 'ds:index'],                // rule 7: post-block creation checklist
]
for (const [label, pattern] of agentsRuleChecks) {
  check(
    `AGENTS.md contains ${label}`,
    fileContains('AGENTS.md', pattern),
    `Expected to find "${pattern}" in AGENTS.md Design System section`,
  )
}

// ─── HTTP CHECKS ─────────────────────────────────────────────────────────────

console.log('\n── HTTP checks (requires running dev server) ────────────────')

const BASE = 'http://localhost:3000'

const httpResults = await Promise.all([
  httpCheck(`${BASE}/craft`, [200]).then((ok) => ({ label: 'GET /craft returns 200', ok })),
  httpCheck(`${BASE}/theory`, [200]).then((ok) => ({ label: 'GET /theory returns 200', ok })),
  httpCheck(`${BASE}/process`, [200]).then((ok) => ({ label: 'GET /process returns 200', ok })),
  httpCheck(`${BASE}/`, [200]).then((ok) => ({ label: 'GET / returns 200', ok })),
  httpCheck(`${BASE}/craft/digital-horizons`, [200]).then((ok) => ({ label: 'GET /craft/digital-horizons returns 200 (seeded article)', ok })),
  httpCheck(`${BASE}/admin`, [200]).then((ok) => ({ label: 'GET /admin returns 200', ok })),
])

for (const { label, ok } of httpResults) {
  check(label, ok, ok ? undefined : 'Request failed — ensure dev server is running on http://localhost:3000 before running this script')
}

// ─── SUMMARY ────────────────────────────────────────────────────────────────

console.log('\n─────────────────────────────────────────────────────────────')

if (failures === 0) {
  console.log(`\n${PASS} All checks passed. Design System Phase 1 verification complete.\n`)
  process.exit(0)
} else {
  console.log(`\n${FAIL} ${failures} check${failures === 1 ? '' : 's'} failed. Resolve before marking phase complete.\n`)
  process.exit(1)
}
