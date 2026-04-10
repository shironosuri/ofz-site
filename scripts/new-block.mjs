import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = process.cwd()
const BLOCKS_DIR = join(ROOT, 'src/blocks')
const SCOPE_TO_SURFACES = {
  article: ['article'],
  inline: ['inline'],
  page: ['page'],
}

const MANUAL_REGISTRATION_TARGETS = {
  article: {
    steps: (name, slug) => [
      {
        filePath: 'src/collections/Posts/index.ts',
        instructions: [
          `Add import:  import { ${name} } from '../../blocks/${name}/config'`,
          `Add to blocks array: blocks: [..., ${name}]`,
        ],
      },
      {
        filePath: 'src/blocks/RenderArticleBlocks.tsx',
        instructions: [
          `Add type import:  import type { ${name}Block as ${name}BlockProps } from '@/payload-types'`,
          `Add component import:  import { ${name} as ${name}Component } from '@/blocks/${name}/Component'`,
          `Extend ArticleBlock union:  | ${name}BlockProps`,
          `Add to blockComponents map: ${slug}: ${name}Component,`,
        ],
      },
    ],
  },
  inline: {
    steps: (name, slug) => [
      {
        filePath: 'src/blocks/sharedBodyEditor.ts',
        instructions: [
          `Add import:  import { ${name} } from '@/blocks/${name}/config'`,
          `Add to BlocksFeature array: ${name}`,
        ],
      },
      {
        filePath: 'src/components/RichText/index.tsx',
        instructions: [
          `Add type import:  import type { ${name}Block as ${name}BlockProps } from '@/payload-types'`,
          `Add component import:  import { ${name} as ${name}Component } from '@/blocks/${name}/Component'`,
          `Add to SerializedBlockNode union:  | ${name}BlockProps`,
          `Add to blocks converter map: ${slug}: ({ node }) => <${name}Component {...node.fields} />,`,
        ],
      },
    ],
  },
  page: {
    steps: (name, slug) => [
      {
        filePath: 'src/collections/Pages/index.ts',
        instructions: [
          `Add import:  import { ${name} } from '../../blocks/${name}/config'`,
          `Add to blocks array: blocks: [..., ${name}]`,
        ],
      },
      {
        filePath: 'src/blocks/RenderBlocks.tsx',
        instructions: [
          `Add import:  import { ${name} as ${name}Component } from '@/blocks/${name}/Component'`,
          `Add to blockComponents map: ${slug}: ${name}Component,`,
        ],
      },
    ],
  },
}

export function toBlockSlug(name) {
  return name.slice(0, 1).toLowerCase() + name.slice(1)
}

function parseArgs(argv) {
  const [, , name, ...rest] = argv

  if (!name) {
    throw new Error('Usage: pnpm block:new <Name> --scope page|article|inline')
  }

  if (!/^[A-Z][A-Za-z0-9]*$/.test(name)) {
    throw new Error('Block name must be PascalCase, for example: TestScaffold')
  }

  const scopeIndex = rest.indexOf('--scope')
  const scope = scopeIndex === -1 ? undefined : rest[scopeIndex + 1]

  if (!scope || !(scope in SCOPE_TO_SURFACES)) {
    throw new Error('Missing or invalid --scope. Use one of: page, article, inline')
  }

  return {
    name,
    scope,
  }
}

function buildConfigSource(name, slug) {
  return `import type { Block } from 'payload'

export const ${name}: Block = {
  slug: '${slug}',
  interfaceName: '${name}Block',
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
  ],
}
`
}

function buildComponentSource(name, slug, scope) {
  if (scope === 'article') {
    return `import React from 'react'

type Props = {
  block: {
    heading?: string | null
  }
  className?: string
}

export const ${name}: React.FC<Props> = ({ block, className = '' }) => {
  // TODO: implement ${name}.
  return <section className={className}>{block.heading}</section>
}
`
  }

  return `import React from 'react'

type Props = {
  blockName?: string
  blockType?: '${slug}'
  className?: string
  disableInnerContainer?: boolean
  heading?: string | null
}

export const ${name}: React.FC<Props> = ({ className, heading }) => {
  // TODO: implement ${name}.
  return <div className={className}>{heading}</div>
}
`
}

function buildMetaSource(slug, scope) {
  const surfaces = SCOPE_TO_SURFACES[scope].map((value) => `'${value}'`).join(', ')

  return `import type { BlockMeta } from '../blockMeta'

export const meta = {
  slug: '${slug}',
  surfaces: [${surfaces}],
  purpose: 'TODO: describe what this block is for.',
} satisfies BlockMeta
`
}

export function getManualRegistrationInstructions(name, scope) {
  const slug = toBlockSlug(name)
  const target = MANUAL_REGISTRATION_TARGETS[scope]

  if (!target) {
    throw new Error(`Unsupported scope for manual instructions: ${scope}`)
  }

  return {
    heading: `Manual registration required for ${name} (--scope ${scope}):`,
    steps: target.steps(name, slug),
  }
}

function printManualInstructions(name, scope) {
  const instructions = getManualRegistrationInstructions(name, scope)

  console.log(instructions.heading)

  instructions.steps.forEach((step, index) => {
    console.log(`${index + 1}. ${step.filePath}`)
    step.instructions.forEach((instruction) => {
      console.log(`   ${instruction}`)
    })
  })
}

function runPostScaffoldCommands() {
  execFileSync('pnpm', ['generate:types'], {
    cwd: ROOT,
    stdio: 'inherit',
  })
  execFileSync('pnpm', ['ds:index'], {
    cwd: ROOT,
    stdio: 'inherit',
  })
}

function run() {
  const { name, scope } = parseArgs(process.argv)
  const slug = toBlockSlug(name)
  const blockDir = join(BLOCKS_DIR, name)

  if (existsSync(blockDir)) {
    throw new Error(`Block directory already exists: ${blockDir}`)
  }

  mkdirSync(blockDir, { recursive: true })
  writeFileSync(join(blockDir, 'config.ts'), buildConfigSource(name, slug))
  writeFileSync(join(blockDir, 'Component.tsx'), buildComponentSource(name, slug, scope))
  writeFileSync(join(blockDir, 'meta.ts'), buildMetaSource(slug, scope))

  console.log(`Created ${blockDir.replace(`${ROOT}/`, '')}`)
  printManualInstructions(name, scope)

  runPostScaffoldCommands()
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
