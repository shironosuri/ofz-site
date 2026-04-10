import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const UI_DIR = 'src/components/ui'
const BLOCKS_DIR = 'src/blocks'
const OUTPUT_DIR = 'design-system'
const COMPONENT_INDEX_FILE = join(OUTPUT_DIR, 'component-index.json')
const BLOCK_CATALOG_FILE = join(OUTPUT_DIR, 'block-catalog.json')
const SUMMARY_FILE = join(OUTPUT_DIR, 'SUMMARY.md')
const SUMMARY_BLOCK_START = '<!-- DS:BLOCKS:START -->'
const SUMMARY_BLOCK_END = '<!-- DS:BLOCKS:END -->'

const slugPattern = /\bslug\s*:\s*['"`]([^'"`]+)['"`]/
const surfacesPattern = /surfaces\s*:\s*(\[[^\]]*\])/
const purposePattern = /purpose\s*:\s*['"`]([^'"`]+)['"`]/
const composesWithPattern = /composesWith\s*:\s*(\[[^\]]*\])/
const quotedStringPattern = /['"`]([^'"`]+)['"`]/g

export function surfacesToLegacyType(surfaces) {
  if (!Array.isArray(surfaces) || surfaces.length === 0) {
    return 'unknown'
  }

  if (surfaces.length === 1) {
    return surfaces[0]
  }

  return 'both'
}

export function parseComposesWithField(content) {
  const composesWithMatch = content.match(composesWithPattern)

  if (!composesWithMatch?.[1]) {
    return []
  }

  try {
    const composesWith = JSON.parse(composesWithMatch[1].replace(/'/g, '"'))

    if (!Array.isArray(composesWith) || !composesWith.every((value) => typeof value === 'string')) {
      return []
    }

    return composesWith
  } catch {
    return []
  }
}

function listUiPrimitives() {
  return readdirSync(UI_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
    .map((entry) => ({
      name: entry.name.replace(/\.tsx$/, ''),
      path: `${UI_DIR}/${entry.name}`,
    }))
    .sort((left, right) => left.name.localeCompare(right.name))
}

function parseMetaFile(metaPath) {
  const metaSource = readFileSync(metaPath, 'utf8')
  const surfacesMatch = metaSource.match(surfacesPattern)
  const purposeMatch = metaSource.match(purposePattern)

  if (!surfacesMatch?.[1]) {
    throw new Error(`Failed to parse surfaces from ${metaPath}`)
  }

  if (!purposeMatch?.[1]) {
    throw new Error(`Failed to parse purpose from ${metaPath}`)
  }

  const surfaces = Array.from(surfacesMatch[1].matchAll(quotedStringPattern), (match) => match[1])

  if (surfaces.length === 0) {
    throw new Error(`Failed to parse surfaces from ${metaPath}`)
  }

  return {
    surfaces,
    purpose: purposeMatch[1],
    composesWith: parseComposesWithField(metaSource),
  }
}

function shareSurface(left, right) {
  return left.some((surface) => right.includes(surface))
}

function validateCatalogCompositionRelationships(catalogBlocks) {
  const blocksBySlug = new Map(catalogBlocks.map((block) => [block.slug, block]))

  for (const block of catalogBlocks) {
    for (const relatedSlug of block.composesWith) {
      const relatedBlock = blocksBySlug.get(relatedSlug)

      if (!relatedBlock) {
        throw new Error(`Block "${block.slug}" composesWith unknown slug "${relatedSlug}"`)
      }

      if (!shareSurface(block.surfaces, relatedBlock.surfaces)) {
        throw new Error(
          `Block "${block.slug}" composesWith "${relatedSlug}" across different surfaces (${block.surfaces.join(', ')} vs ${relatedBlock.surfaces.join(', ')})`,
        )
      }

      if (!relatedBlock.composesWith.includes(block.slug)) {
        throw new Error(`Block "${block.slug}" composesWith "${relatedSlug}" but the relationship is not symmetric`)
      }
    }
  }
}

function readBlockEntries() {
  return readdirSync(BLOCKS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right))
    .flatMap((dir) => {
      const dirPath = join(BLOCKS_DIR, dir)
      const files = readdirSync(dirPath)

      if (!files.includes('config.ts')) {
        return []
      }

      const configPath = join(dirPath, 'config.ts')
      const configSource = readFileSync(configPath, 'utf8')
      const slugMatch = configSource.match(slugPattern)

      if (!slugMatch?.[1]) {
        throw new Error(`Failed to parse block slug from ${configPath}`)
      }

      const slug = slugMatch[1]
      const metaPath = join(dirPath, 'meta.ts')
      if (!files.includes('meta.ts')) {
        throw new Error(`Missing meta.ts for ${configPath}`)
      }

      const { surfaces, purpose, composesWith } = parseMetaFile(metaPath)

      return [
        {
          catalog: {
            slug,
            dir,
            surfaces,
            purpose,
            composesWith,
          },
          componentIndex: {
            slug,
            dir,
            hasConfig: true,
            hasComponent: files.some((file) => /^Component(\.[^.]+)?\.tsx$/.test(file)),
            type: surfacesToLegacyType(surfaces),
          },
        },
      ]
    })
}

function formatPurposeForMarkdown(purpose) {
  return purpose.replace(/\|/g, '\\|')
}

function buildSummaryBlockTable(catalogBlocks) {
  const rows = catalogBlocks.map(
    (block) =>
      `| \`${block.slug}\` | \`${block.dir}\` | \`${block.surfaces.join(' + ')}\` | ${formatPurposeForMarkdown(block.purpose)} |`,
  )

  return ['| Slug | Dir | Surfaces | Purpose |', '|---|---|---|---|', ...rows].join('\n')
}

function findTableEndIndex(source, tableStartIndex, sectionEndIndex) {
  const tableSection = source.slice(tableStartIndex, sectionEndIndex)
  let offset = 0
  let tableEndOffset = 0

  for (const line of tableSection.split('\n')) {
    const lineLength = line.length

    if (line.trim().startsWith('|')) {
      tableEndOffset = offset + lineLength
      offset += lineLength + 1
      continue
    }

    if (tableEndOffset > 0) {
      break
    }

    offset += lineLength + 1
  }

  if (tableEndOffset === 0) {
    throw new Error(`Failed to locate the end of the block registry table in ${SUMMARY_FILE}`)
  }

  return tableStartIndex + tableEndOffset
}

function writeSummaryBlockSection(summarySource, catalogBlocks) {
  const table = buildSummaryBlockTable(catalogBlocks)
  const startIndex = summarySource.indexOf(SUMMARY_BLOCK_START)
  const endIndex = summarySource.indexOf(SUMMARY_BLOCK_END)

  if (startIndex !== -1 || endIndex !== -1) {
    if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
      throw new Error(`Failed to locate valid ${SUMMARY_BLOCK_START}/${SUMMARY_BLOCK_END} markers in ${SUMMARY_FILE}`)
    }

    const before = summarySource.slice(0, startIndex + SUMMARY_BLOCK_START.length)
    const after = summarySource.slice(endIndex)
    return `${before}\n${table}\n${after}`
  }

  const headingIndex = summarySource.indexOf('## Block Registry')
  const sectionEndIndex = summarySource.indexOf('\n## Block Creation Checklist', headingIndex)
  const tableStartIndex = summarySource.indexOf('| Slug |', headingIndex)

  if (headingIndex === -1 || sectionEndIndex === -1 || tableStartIndex === -1) {
    throw new Error(`Failed to locate the block registry section in ${SUMMARY_FILE}`)
  }

  const tableEndIndex = findTableEndIndex(summarySource, tableStartIndex, sectionEndIndex)
  const before = summarySource.slice(0, tableStartIndex)
  const after = summarySource.slice(tableEndIndex)

  return `${before}${SUMMARY_BLOCK_START}\n${table}\n${SUMMARY_BLOCK_END}${after}`
}

function run() {
  const ui = listUiPrimitives()
  const summarySource = readFileSync(SUMMARY_FILE, 'utf8')
  const blockEntries = readBlockEntries()
  const catalogBlocks = blockEntries.map((entry) => entry.catalog)

  validateCatalogCompositionRelationships(catalogBlocks)

  const componentIndex = {
    generated: new Date().toISOString(),
    ui,
    blocks: blockEntries.map((entry) => entry.componentIndex),
  }
  const blockCatalog = {
    generated: new Date().toISOString(),
    blocks: catalogBlocks,
  }
  const nextSummary = writeSummaryBlockSection(summarySource, blockCatalog.blocks)

  mkdirSync(OUTPUT_DIR, { recursive: true })
  writeFileSync(COMPONENT_INDEX_FILE, `${JSON.stringify(componentIndex, null, 2)}\n`)
  writeFileSync(BLOCK_CATALOG_FILE, `${JSON.stringify(blockCatalog, null, 2)}\n`)
  writeFileSync(SUMMARY_FILE, nextSummary)

  console.log(
    `Indexed ${ui.length} UI primitives and ${componentIndex.blocks.length} blocks into ${COMPONENT_INDEX_FILE}.`,
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    run()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(message)
    process.exit(1)
  }
}
