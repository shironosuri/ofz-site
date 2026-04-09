import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const UI_DIR = 'src/components/ui'
const BLOCKS_DIR = 'src/blocks'
const OUTPUT_DIR = 'design-system'
const OUTPUT_FILE = join(OUTPUT_DIR, 'component-index.json')

const blockTypes = {
  archive: 'page',
  cta: 'page',
  content: 'page',
  formBlock: 'page',
  mediaBlock: 'both',
  richTextSection: 'article',
  stepSection: 'article',
  dividerBlock: 'article',
  articleCallout: 'inline',
  articleAside: 'inline',
  articleStackGrid: 'inline',
  banner: 'inline',
  code: 'inline',
}

const slugPattern = /\bslug\s*:\s*['"`]([^'"`]+)['"`]/

try {
  const ui = readdirSync(UI_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
    .map((entry) => ({
      name: entry.name.replace(/\.tsx$/, ''),
      path: `${UI_DIR}/${entry.name}`,
    }))
    .sort((left, right) => left.name.localeCompare(right.name))

  const blocks = readdirSync(BLOCKS_DIR, { withFileTypes: true })
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
      const type = blockTypes[slug] ?? 'unknown'

      if (type === 'unknown') {
        console.warn(`Unknown block slug "${slug}" in ${configPath}; defaulting type to "unknown".`)
      }

      return [
        {
          slug,
          dir,
          hasConfig: true,
          hasComponent: files.some((file) => /^Component(\.[^.]+)?\.tsx$/.test(file)),
          type,
        },
      ]
    })

  const index = {
    generated: new Date().toISOString(),
    ui,
    blocks,
  }

  mkdirSync(OUTPUT_DIR, { recursive: true })
  writeFileSync(OUTPUT_FILE, `${JSON.stringify(index, null, 2)}\n`)
  console.log(`Indexed ${ui.length} UI primitives and ${blocks.length} blocks into ${OUTPUT_FILE}.`)
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(message)
  process.exit(1)
}
