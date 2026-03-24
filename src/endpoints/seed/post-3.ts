import { buildEditorState } from '@payloadcms/richtext-lexical'
import { RequiredDataFromCollectionSlug } from 'payload'
import type { PostArgs } from './post-1'

const textNode = (text: string, format = 0) => ({
  type: 'text' as const,
  detail: 0,
  format,
  mode: 'normal' as const,
  style: '',
  text,
  version: 1,
})

const paragraph = (text: string) => ({
  type: 'paragraph' as const,
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  textStyle: '',
  version: 1,
})

const heading = (text: string, tag: 'h3' | 'h4' = 'h3') => ({
  type: 'heading' as const,
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  tag,
  version: 1,
})

const listItem = (text: string, value: number) => ({
  type: 'listitem' as const,
  children: [paragraph(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  value,
  version: 1,
})

const bulletList = (items: string[]) => ({
  type: 'list' as const,
  children: items.map((item, index) => listItem(item, index + 1)),
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  listType: 'bullet' as const,
  start: 1,
  tag: 'ul' as const,
  version: 1,
})

const blockNode = (fields: Record<string, unknown>) => ({
  type: 'block' as const,
  fields: {
    blockName: '',
    ...fields,
  },
  format: '' as const,
  version: 2,
})

const editorState = (nodes: any[]) => buildEditorState({ nodes })

const codeBlock = (language: 'bash' | 'typescript' | 'markup', code: string) =>
  blockNode({
    blockType: 'code',
    language,
    code,
  })

const asideBlock = (style: 'note' | 'warning' | 'tip', content: string[]) =>
  blockNode({
    blockType: 'articleAside',
    style,
    content: editorState(content.map(paragraph)),
  })

const stackGridBlock = (
  items: Array<{
    label: string
    name: string
    description: string
  }>,
) =>
  blockNode({
    blockType: 'articleStackGrid',
    items,
  })

const richTextSection = (nodes: any[], headingText?: string) => ({
  blockType: 'richTextSection' as const,
  ...(headingText ? { heading: headingText } : {}),
  body: editorState(nodes),
})

const stepSection = (stepLabel: string, stepHeader: string, nodes: any[]) => ({
  blockType: 'stepSection' as const,
  stepLabel,
  stepHeader,
  body: editorState(nodes),
})

export const post3: (args: PostArgs) => RequiredDataFromCollectionSlug<'posts'> = ({ heroImage, author }) => {
  return {
    slug: 'nextjs-payload-local-setup-guide',
    _status: 'published',
    authors: [author],
    category: 'process',
    eyebrow: 'Local Setup Guide',
    title: 'Next.js + Payload - running locally in an afternoon.',
    subtitle:
      "A quick-reference setup for getting a Next.js and Payload CMS environment running on your machine. Whatever you're building - start here.",
    content: [
      {
        blockType: 'dividerBlock',
      },
      richTextSection([
        paragraph(
          "Next.js handles the front end. Payload gives you a content backend and admin panel without writing API boilerplate. PostgreSQL runs in a Docker container so you're not installing anything globally. Together they're flexible enough to build almost anything - a portfolio, a blog, a presskit, a multimedia site - and opinionated enough that you're not starting from scratch every time.",
        ),
        paragraph('This guide gets the environment running. What you build in it is up to you.'),
      ]),
      stepSection('The stack', "What you're building and why", [
        paragraph("Here's the full picture before we touch a terminal:"),
        stackGridBlock([
          {
            label: 'Frontend + Server',
            name: 'Next.js',
            description: "Your project's public face - release page, portfolio, presskit, store",
          },
          {
            label: 'Backend / Admin',
            name: 'Payload CMS',
            description: 'Manage content, assets, metadata - schema lives in your code, not a third-party dashboard',
          },
          {
            label: 'Database',
            name: 'PostgreSQL',
            description: 'Stores everything. Runs locally in Docker; deploy anywhere later',
          },
          {
            label: 'Package Manager',
            name: 'pnpm',
            description: 'Faster installs, strict dependency isolation - no mystery conflicts',
          },
        ]),
        paragraph(
          "Why Payload over something like Contentful or Sanity? Because it runs in your repo. Your schema, your data, your server. When your project pipeline changes - and it will - you change the code, not a third-party dashboard plan.",
        ),
      ]),
      stepSection('Step 01', 'Prerequisites - what you need before starting', [
        paragraph('Install these four things. Everything else follows from them.'),
        bulletList([
          'Node.js 20+ (LTS recommended - check with node -v). Payload 3 requires Next.js 15, which requires Node 20+.',
          'Git - version control from day one, not as an afterthought.',
          "Docker Desktop - we'll run PostgreSQL in a container, no local install needed.",
          "pnpm - enabled through Node's built-in corepack.",
        ]),
        heading('Enable pnpm via corepack'),
        codeBlock(
          'bash',
          `# One-time setup - corepack ships with Node 20+
corepack enable
corepack prepare pnpm@latest --activate

# Confirm it works
pnpm -v`,
        ),
        asideBlock('warning', [
          "Don't mix package managers. Once you're on pnpm, stay on pnpm. Running npm install inside a pnpm project creates a second lockfile and subtle dependency conflicts that are annoying to debug mid-production.",
        ]),
      ]),
      stepSection('Step 02', 'Scaffold the project with create-payload-app', [
        paragraph(
          "Payload 3 is Next.js-native - it lives directly inside your /app folder. The scaffold command sets up Next.js and Payload together correctly, including all the route files that Payload needs. Don't create a Next.js app first and try to add Payload after; the scaffolder handles the wiring.",
        ),
        codeBlock(
          'bash',
          `pnpm create payload-app@latest my-project
cd my-project`,
        ),
        paragraph(
          "The interactive wizard will ask a few questions. The most important is the template - here's what each one gives you:",
        ),
        bulletList([
          'blank - a minimal working setup with no demo content, no styling, and no pre-built collections beyond Users and Media. This is the right choice if you want full control and plan to build your own structure from scratch.',
          'website - a production-ready site with Tailwind, a page builder, Posts, Projects, and Pages collections, SEO plugin, redirects, and a working front end.',
          'ecommerce - a full e-commerce setup with products, cart, orders, and Stripe integration pre-configured.',
          'plugin - scaffolds a Payload plugin package rather than a site. Not relevant here.',
        ]),
        paragraph('For the remaining wizard prompts, choose:'),
        bulletList([
          'Database - select postgres.',
          'Database connection string - leave blank for now; you will set it in .env in the next step.',
        ]),
        asideBlock('note', [
          "The blank template does not include Tailwind CSS or any other styling framework - you start with a clean slate. Other templates like website come with Tailwind pre-installed.",
        ]),
        asideBlock('tip', [
          'The scaffolder creates a src/app/(payload)/ route group with all the files Payload needs - the admin panel, REST API, and GraphQL routes. These files are boilerplate; you do not edit them.',
        ]),
      ]),
      stepSection('Step 03', 'Configure Docker for PostgreSQL', [
        paragraph(
          'The scaffolder creates a docker-compose.yml set up for MongoDB by default. Replace the entire file with this - it switches the dependency to Postgres, comments out Mongo, and uncomments the Postgres service.',
        ),
        codeBlock(
          'markup',
          `version: '3'

services:
  payload:
    image: node:18-alpine
    ports:
      - '3000:3000'
    volumes:
      - .:/home/node/app
      - node_modules:/home/node/app/node_modules
    working_dir: /home/node/app/
    command: sh -c "corepack enable && corepack prepare pnpm@latest --activate && pnpm install && pnpm dev"
    depends_on:
      - postgres
    env_file:
      - .env

  # mongo:
  #   image: mongo:latest
  #   ports:
  #     - '27017:27017'
  #   command:
  #     - --storageEngine=wiredTiger
  #   volumes:
  #     - data:/data/db
  #   logging:
  #     driver: none

  postgres:
    restart: always
    image: postgres:latest
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: payload
    volumes:
      - pgdata:/var/lib/postgresql
    ports:
      - "5432:5432"

volumes:
  data:
  pgdata:
  node_modules:`,
        ),
        paragraph('Then start the database:'),
        codeBlock('bash', 'docker compose up -d postgres'),
        asideBlock('tip', [
          "Passing postgres as an argument starts only the database container, not the Node service - you'll run pnpm dev directly on your machine in the next step, which is faster for development than running everything inside Docker.",
        ]),
        asideBlock('warning', [
          'These credentials are for local development only. The values in docker-compose.yml and the connection string in your .env need to match each other, but for production you should use strong unique values managed through your hosting provider.',
        ]),
      ]),
      stepSection('Step 04', 'Set up environment variables', [
        paragraph('The scaffolder creates a .env.example file. Copy it and fill in your values:'),
        codeBlock('bash', 'cp .env.example .env'),
        paragraph('Then edit .env:'),
        codeBlock(
          'bash',
          `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/payload
PAYLOAD_SECRET=your-secret-key-make-this-long-and-random`,
        ),
        asideBlock('warning', [
          '.env is already in .gitignore - the scaffolder handles that. The PAYLOAD_SECRET signs authentication tokens; treat it like a password and never commit it.',
        ]),
      ]),
      stepSection('Step 05', 'Review your Payload config', [
        paragraph('The scaffolder creates src/payload.config.ts - this is the heart of your backend. Out of the box it looks something like this:'),
        codeBlock(
          'typescript',
          `import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor(),
  collections: [],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
})`,
        ),
        paragraph("The collections array is where you'll define your content types later. Leave it empty for now."),
        asideBlock('note', [
          "Note that buildConfig is imported from 'payload', not 'payload/config' - that was the v2 path. If you see old tutorials using the v2 import, they are outdated.",
        ]),
      ]),
      stepSection('Step 06', 'Check your next.config.ts', [
        paragraph('The scaffolder also sets up next.config.ts with the Payload plugin already wired in:'),
        codeBlock(
          'typescript',
          `import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // your Next.js config here
}

export default withPayload(nextConfig)`,
        ),
        paragraph("You don't need to touch this file to get started. The withPayload wrapper handles compatibility with Payload's internal packages."),
      ]),
      stepSection('Step 07', 'Run it', [
        paragraph('The database should already be running from Step 03. Start the dev server locally:'),
        codeBlock('bash', 'pnpm dev'),
        paragraph('You now have two things running:'),
        bulletList([
          'Your site at http://localhost:3000.',
          'Your admin panel at http://localhost:3000/admin.',
        ]),
        paragraph(
          'The first time you load the admin, Payload will ask you to create an admin user. Do that, then start defining collections that match your actual production workflow.',
        ),
      ]),
      stepSection('Step 08', 'Push to GitHub', [
        paragraph(
          'create-payload-app already initializes a Git repository and makes an initial commit for you. Before pushing, create a new empty repository on GitHub, copy the repo URL, and run:',
        ),
        asideBlock('warning', [
          'Create the repo blank. If you let GitHub add a README, LICENSE, or .gitignore on creation, your push will fail with a non-fast-forward error because the remote will have commits your local repo does not.',
        ]),
        codeBlock(
          'bash',
          `git remote add origin https://github.com/<your-username>/<repo>.git
git branch -M main
git push -u origin main`,
        ),
        asideBlock('tip', [
          'Commit pnpm-lock.yaml to Git. This file locks your exact dependency versions, which matters when you return to the project later or work across multiple machines.',
        ]),
      ]),
      stepSection('Reference', 'Day-to-day commands', [
        paragraph("The pnpm and Git commands you'll use regularly:"),
        codeBlock(
          'bash',
          `# Install all dependencies (for example after cloning the repo)
pnpm install

# Add a new package
pnpm add <package-name>

# Remove a package
pnpm remove <package-name>

# Development server (with hot reload)
pnpm dev

# Production build
pnpm build

# Run production build locally
pnpm start`,
        ),
        codeBlock(
          'bash',
          `# Check status of changed files
git status

# Stage all changes
git add .

# Commit with a message
git commit -m "your message"

# Push to GitHub
git push

# Pull latest changes from GitHub
git pull

# Create and switch to a new branch
git checkout -b <branch-name>

# Switch to an existing branch
git checkout <branch-name>

# Merge a branch into current
git merge <branch-name>`,
        ),
      ]),
      stepSection("What's next", 'Now build something in it', [
        paragraph("You have two directions to go from here, and you'll likely move between them as the project takes shape."),
        paragraph(
          'On the backend, the collections array in src/payload.config.ts is where your content model lives. Define a Posts collection for writing, a Projects collection for work, and a Media collection for uploads - Payload generates a full admin UI and typed API for each one automatically.',
        ),
        paragraph(
          'On the frontend, your public-facing site lives in src/app/ alongside the Payload route group. The scaffolder creates a minimal homepage at src/app/(frontend)/page.tsx - that is your starting point.',
        ),
        paragraph(
          'Future guides in this series can cover both sides in depth: building and querying collections, structuring the frontend, and deploying the whole stack. For now, open the admin panel, create your first user, and start sketching out what the project needs.',
        ),
      ]),
    ],
    heroImage: heroImage.id,
    meta: {
      description:
        "A quick-reference setup for getting a Next.js and Payload CMS environment running on your machine. Whatever you're building - start here.",
      image: heroImage.id,
      title: 'Next.js + Payload - running locally in an afternoon.',
    },
    relatedPosts: [],
  }
}
