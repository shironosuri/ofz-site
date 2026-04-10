/**
 * Verification script — Design System Phase 2
 * Run with: pnpm tsx scripts/verify-design-system-p2.ts
 *
 * Requires a running dev server on http://localhost:3000 for HTTP checks.
 * All file-system checks run without a server.
 *
 * Exits with code 1 if any check fails.
 *
 * Note: pnpm tsc --noEmit, pnpm generate:types, and pnpm vitest run are NOT
 * run by this script — they must be run separately as part of Step 6.
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
  if (!fileExists(rel)) return true
  const content = readFileSync(join(ROOT, rel), 'utf-8')
  return typeof pattern === 'string' ? !content.includes(pattern) : !pattern.test(content)
}

function readFile(rel: string): string {
  return readFileSync(join(ROOT, rel), 'utf-8')
}

function dirExists(rel: string): boolean {
  const full = join(ROOT, rel)
  return existsSync(full) && statSync(full).isDirectory()
}

async function httpCheck(url: string, expectedStatus: number[]): Promise<{ ok: boolean; body?: string }> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    const body = await res.text()
    return { ok: expectedStatus.includes(res.status), body }
  } catch {
    return { ok: false }
  }
}

// ─── TAILWIND COLOR ALIASES ──────────────────────────────────────────────────

console.log('\n── Tailwind color aliases ───────────────────────────────────')

const GLOBALS_CSS = 'src/app/(frontend)/globals.css'

const requiredAliases = [
  '--color-brand-accent: var(--ds-color-brand-accent)',
  '--color-brand-accent-muted: var(--ds-color-brand-accent-muted)',
  '--color-content-paper: var(--ds-color-content-paper)',
  '--color-content-cream: var(--ds-color-content-cream)',
  '--color-content-ink: var(--ds-color-content-ink)',
  '--color-content-copy: var(--ds-color-content-copy)',
  '--color-content-quote: var(--ds-color-content-quote)',
  '--color-content-comment: var(--ds-color-content-comment)',
  '--color-content-caption: var(--ds-color-content-caption)',
  '--color-content-rule: var(--ds-color-content-rule)',
  '--color-content-code-bg: var(--ds-color-content-code-background)',
  '--color-content-code-text: var(--ds-color-content-code-text)',
  '--color-content-code-highlight: var(--ds-color-content-code-highlight)',
]

check('globals.css exists', fileExists(GLOBALS_CSS))

for (const alias of requiredAliases) {
  check(
    `globals.css @theme inline contains: ${alias.split(':')[0].trim()}`,
    fileContains(GLOBALS_CSS, alias),
    `Expected entry: ${alias}`,
  )
}

check(
  'globals.css does not contain long-form --color-ds-color-* aliases',
  fileNotContains(GLOBALS_CSS, /--color-ds-color-/),
  'Found --color-ds-color-* — use short alias names like --color-brand-accent',
)

check('globals.css still imports tokens.css', fileContains(GLOBALS_CSS, 'tokens.css'))

// ─── PRIMITIVE NORMALIZATION ─────────────────────────────────────────────────

console.log('\n── Primitive normalization ──────────────────────────────────')

if (dirExists('src/components/ui')) {
  const uiFiles = readdirSync(join(ROOT, 'src/components/ui'))
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => `src/components/ui/${f}`)

  check('src/components/ui/ contains files', uiFiles.length > 0)

  const hexPattern = /#[0-9a-fA-F]{3,6}\b/
  const arbitraryColorPattern = /(?:bg|text|border|ring|fill|stroke)-\[#[0-9a-fA-F]/
  const hexViolations: string[] = []
  const arbitraryViolations: string[] = []

  for (const file of uiFiles) {
    const content = readFile(file)
    if (hexPattern.test(content)) hexViolations.push(file)
    if (arbitraryColorPattern.test(content)) arbitraryViolations.push(file)
  }

  check(
    'No ui/ file contains bare hex values',
    hexViolations.length === 0,
    hexViolations.length > 0 ? `Violations: ${hexViolations.join(', ')}` : undefined,
  )

  check(
    'No ui/ file contains arbitrary Tailwind color classes (bg-[#...], text-[#...])',
    arbitraryViolations.length === 0,
    arbitraryViolations.length > 0 ? `Violations: ${arbitraryViolations.join(', ')}` : undefined,
  )
} else {
  check('src/components/ui/ exists', false)
}

// ─── VITEST CONFIGURATION ─────────────────────────────────────────────────────

console.log('\n── Vitest configuration ─────────────────────────────────────')

check(
  'vitest.config.mts includes scripts/**/*.test.mjs',
  fileContains('vitest.config.mts', 'scripts/**/*.test.mjs'),
  'Expected "scripts/**/*.test.mjs" in vitest.config.mts include array',
)

// ─── BLOCKMETA TYPE ──────────────────────────────────────────────────────────

console.log('\n── BlockMeta type ───────────────────────────────────────────')

check('src/blocks/blockMeta.ts exists', fileExists('src/blocks/blockMeta.ts'))

if (fileExists('src/blocks/blockMeta.ts')) {
  const blockMetaContent = readFile('src/blocks/blockMeta.ts')

  check(
    'blockMeta.ts exports BlockMeta type or interface',
    /export\s+(?:type|interface)\s+BlockMeta/.test(blockMetaContent),
    'Expected "export type BlockMeta" or "export interface BlockMeta"',
  )

  check(
    'blockMeta.ts does not export any function',
    !/export\s+(?:function|const\s+\w+\s*=\s*(?:function|\())/.test(blockMetaContent),
    'Found function export — blockMeta.ts must export only the BlockMeta type',
  )

  check(
    'blockMeta.ts contains surfaces field definition',
    /surfaces/.test(blockMetaContent),
    'Expected "surfaces" in BlockMeta definition',
  )
}

// ─── META.TS FILES ────────────────────────────────────────────────────────────

console.log('\n── meta.ts files ────────────────────────────────────────────')

// slug → dir mapping for all 13 known blocks
const KNOWN_BLOCKS: Record<string, string> = {
  archive: 'ArchiveBlock',
  cta: 'CallToAction',
  content: 'Content',
  formBlock: 'Form',
  mediaBlock: 'MediaBlock',
  richTextSection: 'RichTextSection',
  stepSection: 'StepSection',
  dividerBlock: 'DividerBlock',
  articleCallout: 'ArticleCallout',
  articleAside: 'ArticleAside',
  articleStackGrid: 'ArticleStackGrid',
  banner: 'Banner',
  code: 'Code',
}

// Expected surfaces per block (derived from actual registration files)
const EXPECTED_SURFACES: Record<string, string[]> = {
  archive: ['page'],
  cta: ['page'],
  content: ['page'],
  formBlock: ['page'],
  mediaBlock: ['page', 'inline'],
  richTextSection: ['article'],
  stepSection: ['article'],
  dividerBlock: ['article'],
  articleCallout: ['inline'],
  articleAside: ['inline'],
  articleStackGrid: ['inline'],
  banner: ['inline'],
  code: ['inline'],
}

for (const [slug, dir] of Object.entries(KNOWN_BLOCKS)) {
  const metaPath = `src/blocks/${dir}/meta.ts`
  check(`src/blocks/${dir}/meta.ts exists`, fileExists(metaPath))
  if (!fileExists(metaPath)) continue

  const content = readFile(metaPath)

  check(
    `${dir}/meta.ts imports from '../blockMeta'`,
    content.includes("from '../blockMeta'"),
    "Expected: import type { BlockMeta } from '../blockMeta'",
  )

  check(
    `${dir}/meta.ts uses satisfies BlockMeta`,
    content.includes('satisfies BlockMeta'),
    'Expected: } satisfies BlockMeta',
  )

  check(
    `${dir}/meta.ts has slug: '${slug}'`,
    new RegExp(`slug\\s*:\\s*['"\`]${slug}['"\`]`).test(content),
    `Expected slug: '${slug}'`,
  )

  check(
    `${dir}/meta.ts has purpose field`,
    /purpose\s*:\s*['"`][^'"`]+['"`]/.test(content),
    'Expected a non-empty purpose string',
  )

  check(
    `${dir}/meta.ts does not contain 'both' as a surface`,
    !content.includes("'both'") && !content.includes('"both"'),
    "Found 'both' — use explicit surface arrays",
  )

  // Parse surfaces array from meta.ts
  const surfacesMatch = content.match(/surfaces\s*:\s*(\[[^\]]*\])/)
  if (surfacesMatch) {
    const foundSurfaces = [...surfacesMatch[1].matchAll(/['"`]([^'"`]+)['"`]/g)].map((m) => m[1])
    const expected = EXPECTED_SURFACES[slug]
    const matches =
      foundSurfaces.length === expected.length && expected.every((s) => foundSurfaces.includes(s))

    check(
      `${dir}/meta.ts surfaces matches expected ${JSON.stringify(expected)}`,
      matches,
      `Found: ${JSON.stringify(foundSurfaces)}, expected: ${JSON.stringify(expected)}`,
    )
  } else {
    check(`${dir}/meta.ts has parseable surfaces field`, false, 'Could not parse surfaces array')
  }
}

// ─── BIDIRECTIONAL SURFACES VERIFICATION ────────────────────────────────────
//
// Both directions are derived from block-catalog.json.
// Registration is verified against blocks: [...] ARRAY MEMBERSHIP, not import presence.
//
// Why import-only is insufficient:
//   Posts/index.ts imports inline block configs (ArticleCallout etc.) for sharedBodyEditor
//   reuse, but those blocks are NOT in its own blocks: [...] array. Import-only detection
//   would falsely report them as article-surface blocks.
//
// Approach:
//   1. Build varName → dirName map from import statements in each registration file
//   2. Extract PascalCase identifiers from all blocks: [...] arrays in that file
//   3. Map var names to dir names via the import map
//   4. Use the resulting dir set for forward and reverse catalog checks

console.log('\n── Bidirectional surfaces verification ──────────────────────')

const PAGES_INDEX = 'src/collections/Pages/index.ts'
const POSTS_INDEX = 'src/collections/Posts/index.ts'
const SHARED_BODY_EDITOR = 'src/blocks/sharedBodyEditor.ts'

// Build varName → dirName map from block import statements.
// Handles both @/blocks/DirName/config and relative ../../blocks/DirName/config.
function buildBlockImportMap(content: string): Map<string, string> {
  const map = new Map<string, string>()
  // Matches: import { VarName } from '@/blocks/DirName/config' or '../../blocks/DirName/config'
  const pattern =
    /import\s*\{([^}]+)\}\s*from\s*['"](?:@\/blocks|(?:\.\.\/)+blocks)\/(\w+)\/config['"]/g
  for (const match of content.matchAll(pattern)) {
    const dir = match[2]
    for (const rawName of match[1].split(',')) {
      // Handle "Foo as Bar" → use Bar (the local name that appears in code)
      const localName = rawName.trim().replace(/^.*\bas\b\s*/, '').trim()
      if (localName) map.set(localName, dir)
    }
  }
  return map
}

// Extract all PascalCase identifiers that appear inside any blocks: [...] array in a file.
// Uses non-greedy match to avoid consuming nested brackets.
// Matches both `blocks: [A, B, C]` and `BlocksFeature({ blocks: [A, B, C] })`.
function extractBlocksArrayMembers(content: string): Set<string> {
  const members = new Set<string>()
  const arrayPattern = /\bblocks\s*:\s*\[([\s\S]*?)\]/g
  for (const match of content.matchAll(arrayPattern)) {
    for (const varMatch of match[1].matchAll(/\b([A-Z][a-zA-Z0-9]+)\b/g)) {
      members.add(varMatch[1])
    }
  }
  return members
}

// Resolve var names to dir names using the import map.
// Vars with no matching import are silently skipped (they are non-block identifiers).
function resolveToBlockDirs(vars: Set<string>, importMap: Map<string, string>): Set<string> {
  const dirs = new Set<string>()
  for (const varName of vars) {
    const dir = importMap.get(varName)
    if (dir) dirs.add(dir)
  }
  return dirs
}

// Load block-catalog.json as the authority for the bidirectional check.
// If it does not exist, the Generated docs section above already failed.
let catalogBlocks: Array<{ slug: string; dir: string; surfaces: string[] }> = []

if (fileExists('design-system/block-catalog.json')) {
  try {
    const parsed = JSON.parse(readFile('design-system/block-catalog.json'))
    if (Array.isArray(parsed.blocks)) {
      catalogBlocks = parsed.blocks.filter(
        (b: Record<string, unknown>) =>
          typeof b.dir === 'string' && Array.isArray(b.surfaces),
      ) as Array<{ slug: string; dir: string; surfaces: string[] }>
    }
  } catch {
    // parse error already reported in the Generated docs section
  }
}

function catalogEntryForDir(dir: string) {
  return catalogBlocks.find((b) => b.dir === dir)
}

// ── Pages/index.ts — surface 'page' ──

if (fileExists(PAGES_INDEX)) {
  const content = readFile(PAGES_INDEX)
  const importMap = buildBlockImportMap(content)
  const arrayVars = extractBlocksArrayMembers(content)
  const registeredDirs = resolveToBlockDirs(arrayVars, importMap)

  // Forward: every catalog entry with 'page' surface must be in the registered dirs
  for (const entry of catalogBlocks.filter((b) => b.surfaces.includes('page'))) {
    check(
      `${entry.dir} is in Pages/index.ts blocks array (catalog 'page' — forward)`,
      registeredDirs.has(entry.dir),
      `Block ${entry.dir} (slug: ${entry.slug}) declares surface 'page' in catalog but is not in the blocks: [...] array in Pages/index.ts`,
    )
  }

  // Reverse: every dir in the registered array must have a catalog entry with 'page' surface
  for (const dir of registeredDirs) {
    const entry = catalogEntryForDir(dir)
    if (!entry) {
      check(
        `${dir} in Pages/index.ts blocks array has a catalog entry (reverse)`,
        false,
        `Block dir ${dir} is in the Pages/index.ts blocks array but has no entry in block-catalog.json — author meta.ts`,
      )
    } else {
      check(
        `${dir} in Pages/index.ts blocks array declares surface 'page' in catalog (reverse)`,
        entry.surfaces.includes('page'),
        `Block ${dir} (slug: ${entry.slug}) is in Pages/index.ts blocks array but catalog surfaces are ${JSON.stringify(entry.surfaces)} — add 'page'`,
      )
    }
  }
} else {
  check('src/collections/Pages/index.ts exists', false)
}

// ── Posts/index.ts — surface 'article' ──

if (fileExists(POSTS_INDEX)) {
  const content = readFile(POSTS_INDEX)
  const importMap = buildBlockImportMap(content)
  const arrayVars = extractBlocksArrayMembers(content)
  const registeredDirs = resolveToBlockDirs(arrayVars, importMap)
  // Note: Posts/index.ts also imports inline block configs (for sharedBodyEditor).
  // Those vars do NOT appear in the blocks: [...] array, so they are excluded here.

  for (const entry of catalogBlocks.filter((b) => b.surfaces.includes('article'))) {
    check(
      `${entry.dir} is in Posts/index.ts blocks array (catalog 'article' — forward)`,
      registeredDirs.has(entry.dir),
      `Block ${entry.dir} (slug: ${entry.slug}) declares surface 'article' in catalog but is not in the blocks: [...] array in Posts/index.ts`,
    )
  }

  for (const dir of registeredDirs) {
    const entry = catalogEntryForDir(dir)
    if (!entry) {
      check(
        `${dir} in Posts/index.ts blocks array has a catalog entry (reverse)`,
        false,
        `Block dir ${dir} is in the Posts/index.ts blocks array but has no entry in block-catalog.json`,
      )
    } else {
      check(
        `${dir} in Posts/index.ts blocks array declares surface 'article' in catalog (reverse)`,
        entry.surfaces.includes('article'),
        `Block ${dir} (slug: ${entry.slug}) is in Posts/index.ts blocks array but catalog surfaces are ${JSON.stringify(entry.surfaces)}`,
      )
    }
  }
} else {
  check('src/collections/Posts/index.ts exists', false)
}

// ── sharedBodyEditor.ts — surface 'inline' ──

if (fileExists(SHARED_BODY_EDITOR)) {
  const content = readFile(SHARED_BODY_EDITOR)
  const importMap = buildBlockImportMap(content)
  const arrayVars = extractBlocksArrayMembers(content)
  const registeredDirs = resolveToBlockDirs(arrayVars, importMap)

  for (const entry of catalogBlocks.filter((b) => b.surfaces.includes('inline'))) {
    check(
      `${entry.dir} is in sharedBodyEditor.ts blocks array (catalog 'inline' — forward)`,
      registeredDirs.has(entry.dir),
      `Block ${entry.dir} (slug: ${entry.slug}) declares surface 'inline' in catalog but is not in the BlocksFeature blocks array in sharedBodyEditor.ts`,
    )
  }

  for (const dir of registeredDirs) {
    const entry = catalogEntryForDir(dir)
    if (!entry) {
      check(
        `${dir} in sharedBodyEditor.ts blocks array has a catalog entry (reverse)`,
        false,
        `Block dir ${dir} is in the sharedBodyEditor.ts blocks array but has no entry in block-catalog.json`,
      )
    } else {
      check(
        `${dir} in sharedBodyEditor.ts blocks array declares surface 'inline' in catalog (reverse)`,
        entry.surfaces.includes('inline'),
        `Block ${dir} (slug: ${entry.slug}) is in sharedBodyEditor.ts blocks array but catalog surfaces are ${JSON.stringify(entry.surfaces)}`,
      )
    }
  }
} else {
  check('src/blocks/sharedBodyEditor.ts exists', false)
}

// ─── GENERATED DOCS ──────────────────────────────────────────────────────────

console.log('\n── Generated docs ───────────────────────────────────────────')

check('design-system/block-catalog.json exists', fileExists('design-system/block-catalog.json'))

if (fileExists('design-system/block-catalog.json')) {
  let catalog: { blocks?: unknown[] } = {}
  try {
    catalog = JSON.parse(readFile('design-system/block-catalog.json'))
    check('block-catalog.json is valid JSON', true)
  } catch {
    check('block-catalog.json is valid JSON', false, 'Parse error')
  }

  if (Array.isArray(catalog.blocks)) {
    check(
      'block-catalog.json contains all 13 blocks',
      catalog.blocks.length === 13,
      `Expected 13, found ${catalog.blocks.length}`,
    )

    const missingFields: string[] = []
    const surfacesNotArray: string[] = []
    const hasTypeField: string[] = []

    for (const entry of catalog.blocks as Record<string, unknown>[]) {
      const id = String(entry.slug ?? entry.dir ?? '?')
      for (const field of ['slug', 'dir', 'surfaces', 'purpose']) {
        if (!(field in entry)) missingFields.push(`${id} missing "${field}"`)
      }
      if ('surfaces' in entry && !Array.isArray(entry.surfaces)) {
        surfacesNotArray.push(id)
      }
      if ('type' in entry) {
        hasTypeField.push(id)
      }
    }

    check(
      'All block-catalog.json entries have required fields (slug, dir, surfaces, purpose)',
      missingFields.length === 0,
      missingFields.length > 0 ? missingFields.join(', ') : undefined,
    )

    check(
      'All block-catalog.json surfaces fields are arrays',
      surfacesNotArray.length === 0,
      surfacesNotArray.length > 0 ? `Not arrays: ${surfacesNotArray.join(', ')}` : undefined,
    )

    check(
      'block-catalog.json entries do not have a legacy "type" field',
      hasTypeField.length === 0,
      hasTypeField.length > 0
        ? `Found type field in: ${hasTypeField.join(', ')} — type belongs in component-index.json only`
        : undefined,
    )

    // Spot-check: mediaBlock surfaces should be ['page', 'inline']
    const mediaEntry = (catalog.blocks as Record<string, unknown>[]).find((b) => b.slug === 'mediaBlock')
    if (mediaEntry) {
      const surfaces = mediaEntry.surfaces as string[] | undefined
      check(
        "block-catalog.json mediaBlock surfaces is ['page', 'inline']",
        Array.isArray(surfaces) &&
          surfaces.length === 2 &&
          surfaces.includes('page') &&
          surfaces.includes('inline'),
        `Found: ${JSON.stringify(surfaces)}`,
      )
    } else {
      check('block-catalog.json contains mediaBlock entry', false)
    }
  } else {
    check(
      'block-catalog.json has a blocks array',
      false,
      `Expected .blocks to be an array, got ${typeof catalog.blocks}`,
    )
  }
}

// component-index.json still exists and has no "unknown" type
check('design-system/component-index.json exists', fileExists('design-system/component-index.json'))

if (fileExists('design-system/component-index.json')) {
  try {
    const index = JSON.parse(readFile('design-system/component-index.json'))
    const unknownBlocks = (index.blocks as Record<string, unknown>[] | undefined)?.filter(
      (b) => b.type === 'unknown',
    )
    check(
      'component-index.json has no blocks with type "unknown"',
      !unknownBlocks || unknownBlocks.length === 0,
      unknownBlocks?.length ? `Unknown type: ${unknownBlocks.map((b) => b.slug).join(', ')}` : undefined,
    )
  } catch {
    check('component-index.json is valid JSON', false, 'Parse error')
  }
}

// SUMMARY.md sentinel comments
check(
  'design-system/SUMMARY.md has <!-- DS:BLOCKS:START --> sentinel',
  fileContains('design-system/SUMMARY.md', '<!-- DS:BLOCKS:START -->'),
  'Expected sentinel comment — Step 3 adds this around the block registry section',
)

check(
  'design-system/SUMMARY.md has <!-- DS:BLOCKS:END --> sentinel',
  fileContains('design-system/SUMMARY.md', '<!-- DS:BLOCKS:END -->'),
  'Expected sentinel comment — Step 3 adds this around the block registry section',
)

// Regenerated table uses new schema: Surfaces column, not old Key fields column
check(
  'SUMMARY.md block table uses new schema (has Surfaces column)',
  fileContains('design-system/SUMMARY.md', '| Surfaces |'),
  'Expected "| Surfaces |" column header — table has been regenerated with new schema',
)

check(
  'SUMMARY.md block table does not use old Key fields column',
  fileNotContains('design-system/SUMMARY.md', '| Key fields |'),
  'Found "| Key fields |" — old table schema; regenerate with pnpm ds:index',
)

// ds:index no longer has bootstrap blockTypes fallback
check(
  'scripts/index-components.mjs no longer contains bootstrap blockTypes fallback',
  fileNotContains('scripts/index-components.mjs', 'const blockTypes'),
  'Found "const blockTypes" — bootstrap fallback not removed; run ds:index after all meta.ts files are authored',
)

// ─── BLOCK SCAFFOLDER ────────────────────────────────────────────────────────

console.log('\n── Block scaffolder ─────────────────────────────────────────')

check('scripts/new-block.mjs exists', fileExists('scripts/new-block.mjs'))

if (fileExists('package.json')) {
  try {
    const pkg = JSON.parse(readFile('package.json'))
    check(
      'package.json contains block:new script',
      typeof pkg.scripts?.['block:new'] === 'string',
      'Expected "block:new" in package.json scripts',
    )
  } catch {
    check('package.json is valid JSON', false, 'Parse error')
  }
}

// Entrypoint guard should be present in both scripts
check(
  'scripts/index-components.mjs has entrypoint guard',
  fileContains('scripts/index-components.mjs', 'import.meta.url'),
  'Expected CLI entrypoint guard (import.meta.url check) in index-components.mjs',
)

check(
  'scripts/new-block.mjs has entrypoint guard',
  fileContains('scripts/new-block.mjs', 'import.meta.url'),
  'Expected CLI entrypoint guard (import.meta.url check) in new-block.mjs',
)

// No TestScaffold artifacts should remain
check(
  'src/blocks/TestScaffold/ does NOT exist (smoke test artifacts cleaned up)',
  !existsSync(join(ROOT, 'src/blocks/TestScaffold')),
  'TestScaffold directory found — remove it and re-run ds:index before final verification',
)

// ─── AGENTS.MD UPDATES ───────────────────────────────────────────────────────

console.log('\n── AGENTS.md updates ────────────────────────────────────────')

check('AGENTS.md contains meta.ts in block rule', fileContains('AGENTS.md', 'meta.ts'))

check(
  'AGENTS.md block rule mentions all three required files',
  fileContains('AGENTS.md', 'config.ts') &&
    fileContains('AGENTS.md', 'Component.tsx') &&
    fileContains('AGENTS.md', 'meta.ts'),
)

check(
  'AGENTS.md contains DS alias usage example',
  fileContains('AGENTS.md', 'text-brand-accent') || fileContains('AGENTS.md', 'bg-content-paper'),
)

check(
  'AGENTS.md contains spacing clarification',
  fileContains('AGENTS.md', '--ds-spacing') || fileContains('AGENTS.md', 'numeric spacing'),
)

check('AGENTS.md references block-catalog.json', fileContains('AGENTS.md', 'block-catalog.json'))

check(
  'AGENTS.md contains build-surface rubric',
  fileContains('AGENTS.md', 'Payload page') || fileContains('AGENTS.md', 'custom route'),
)

check(
  'AGENTS.md does not contain Phase 1 ui/ exception',
  fileNotContains('AGENTS.md', 'not yet reference'),
  'Phase 1 exception about ui/ token compliance should be removed after Step 2',
)

// ─── HTTP CHECKS ─────────────────────────────────────────────────────────────

console.log('\n── HTTP checks (requires running dev server) ────────────────')

const BASE = 'http://localhost:3000'
const serverError = 'Ensure dev server is running on http://localhost:3000'

const httpResults = await Promise.all([
  httpCheck(`${BASE}/craft`, [200]).then(({ ok }) => ({ label: 'GET /craft returns 200', ok })),
  httpCheck(`${BASE}/theory`, [200]).then(({ ok }) => ({ label: 'GET /theory returns 200', ok })),
  httpCheck(`${BASE}/process`, [200]).then(({ ok }) => ({ label: 'GET /process returns 200', ok })),
  httpCheck(`${BASE}/`, [200]).then(({ ok, body }) => ({
    label: 'GET / returns 200',
    ok,
    body,
    bodyCheck: {
      label: 'GET / response body is non-empty HTML (route-health check only)',
      needle: '<html',
      routeHealthOnly: true,
    },
  })),
  httpCheck(`${BASE}/craft/digital-horizons`, [200]).then(({ ok, body }) => ({
    label: 'GET /craft/digital-horizons returns 200 (seeded article)',
    ok,
    body,
    bodyCheck: {
      label: 'GET /craft/digital-horizons response contains article content',
      needle: 'digital-horizons',
    },
  })),
  httpCheck(`${BASE}/admin`, [200]).then(({ ok }) => ({ label: 'GET /admin returns 200', ok })),
])

for (const result of httpResults) {
  check(result.label, result.ok, result.ok ? undefined : serverError)

  if ('bodyCheck' in result && result.ok && result.body) {
    const { label, needle, routeHealthOnly } = result.bodyCheck as {
      label: string
      needle: string
      routeHealthOnly?: boolean
    }
    // routeHealthOnly checks confirm the response is valid HTML, not that specific seeded content loaded
    check(label, result.body.toLowerCase().includes(needle.toLowerCase()))
    if (routeHealthOnly) {
      // Note: this is a route-health check only — it does not assert that seeded homepage content loaded.
      // To assert seed content, add a known string from the homepage page builder content here.
    }
  }
}

// ─── SUMMARY ────────────────────────────────────────────────────────────────

console.log('\n─────────────────────────────────────────────────────────────')

if (failures === 0) {
  console.log(`\n${PASS} All checks passed. Design System Phase 2 verification complete.\n`)
  process.exit(0)
} else {
  console.log(
    `\n${FAIL} ${failures} check${failures === 1 ? '' : 's'} failed. Resolve before marking phase complete.\n`,
  )
  process.exit(1)
}
