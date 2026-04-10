# Design System Summary

This file is the current agent-facing snapshot of the Phase 1 design system. It is derived from `src/styles/tokens.css`, `design-system/component-index.json`, `src/components/ui/`, and the current block configs under `src/blocks/`.

## Token Quick Reference

### Shared Brand Tokens

Context: `both`

| Token | Value | Usage |
|---|---|---|
| `--ds-color-brand-accent` | Default: `#b5451b` | Brand accent. Links, eyebrows, CTAs, and active states. |
| `--ds-color-brand-accent-muted` | Default: `#d4794d` | Brand accent hover. Hover states, muted emphasis, and secondary highlights. |

### Editorial Content Tokens

Context: `article` / content register only

| Token | Value | Usage |
|---|---|---|
| `--ds-color-content-paper` | Default: `#f5f0e8` | Editorial paper surface. Article canvases and content register backgrounds. |
| `--ds-color-content-cream` | Default: `#ede7d5` | Editorial inset surface. Callouts, asides, and inline code backgrounds. |
| `--ds-color-content-ink` | Default: `#0d0d0d` | Editorial ink. Primary headings, strong rules, and anchor text. |
| `--ds-color-content-copy` | Default: `#3a3530` | Editorial body copy. Hero decks and supporting prose. |
| `--ds-color-content-quote` | Default: `#2a2520` | Editorial pull quote. Large quotations and emphasized narrative copy. |
| `--ds-color-content-comment` | Default: `#6a6050` | Editorial comment tone. Code comments and tertiary annotations. |
| `--ds-color-content-caption` | Default: `#7a6e5e` | Editorial metadata. Bylines, labels, captions, and helper text. |
| `--ds-color-content-rule` | Default: `#c8bfa8` | Editorial rule. Dividers, borders, and stack grid separators. |
| `--ds-color-content-code-background` | Default: `#1a1a1a` | Editorial code surface. Preformatted blocks and dark technical panels. |
| `--ds-color-content-code-text` | Default: `#c8bfa8` | Editorial code foreground. Monospace text on dark technical panels. |
| `--ds-color-content-code-highlight` | Default: `#e8a87c` | Editorial code highlight. Syntax accents and highlighted inline fragments. |
| `--ds-color-content-code-line-number` | Default: `rgba(255, 255, 255, 0.25)` | Editorial code chrome. Subtle line-number and utility text overlays. |

### Semantic Interface Tokens

Context: `general site`

| Token | Value | Usage |
|---|---|---|
| `--ds-color-semantic-background` | Light: `oklch(100% 0 0deg)`<br />Dark: `oklch(14.5% 0 0deg)` | App background. Default page canvas. |
| `--ds-color-semantic-foreground` | Light: `oklch(14.5% 0 0deg)`<br />Dark: `oklch(98.5% 0 0deg)` | App foreground. Default text color. |
| `--ds-color-semantic-card` | Light: `oklch(96.5% 0.005 265deg)`<br />Dark: `oklch(17% 0 0deg)` | Card surface. Elevated containers and cards. |
| `--ds-color-semantic-card-foreground` | Light: `oklch(14.5% 0 0deg)`<br />Dark: `oklch(98.5% 0 0deg)` | Card foreground. Text rendered on card surfaces. |
| `--ds-color-semantic-popover` | Light: `oklch(100% 0 0deg)`<br />Dark: `oklch(14.5% 0 0deg)` | Popover surface. Menus, popovers, and layered panels. |
| `--ds-color-semantic-popover-foreground` | Light: `oklch(14.5% 0 0deg)`<br />Dark: `oklch(98.5% 0 0deg)` | Popover foreground. Text rendered on popovers. |
| `--ds-color-semantic-primary` | Light: `oklch(20.5% 0 0deg)`<br />Dark: `oklch(98.5% 0 0deg)` | Primary action surface. Prominent buttons and primary controls. |
| `--ds-color-semantic-primary-foreground` | Light: `oklch(98.5% 0 0deg)`<br />Dark: `oklch(20.5% 0 0deg)` | Primary action foreground. Text and icons on primary controls. |
| `--ds-color-semantic-secondary` | Light: `oklch(97% 0 0deg)`<br />Dark: `oklch(26.9% 0 0deg)` | Secondary surface. Secondary buttons and neutral emphasis. |
| `--ds-color-semantic-secondary-foreground` | Light: `oklch(20.5% 0 0deg)`<br />Dark: `oklch(98.5% 0 0deg)` | Secondary foreground. Text and icons on secondary surfaces. |
| `--ds-color-semantic-muted` | Light: `oklch(97% 0 0deg)`<br />Dark: `oklch(26.9% 0 0deg)` | Muted surface. Subdued panels and neutral fills. |
| `--ds-color-semantic-muted-foreground` | Light: `oklch(55.6% 0 0deg)`<br />Dark: `oklch(70.8% 0 0deg)` | Muted foreground. Supporting text on muted surfaces. |
| `--ds-color-semantic-accent` | Light: `oklch(97% 0 0deg)`<br />Dark: `oklch(26.9% 0 0deg)` | Accent surface. Interactive accent fills. |
| `--ds-color-semantic-accent-foreground` | Light: `oklch(20.5% 0 0deg)`<br />Dark: `oklch(98.5% 0 0deg)` | Accent foreground. Text and icons on accent surfaces. |
| `--ds-color-semantic-destructive` | Light: `oklch(57.7% 0.245 27.325deg)`<br />Dark: `oklch(39.6% 0.141 25.723deg)` | Destructive surface. Dangerous or destructive actions. |
| `--ds-color-semantic-destructive-foreground` | Light: `oklch(57.7% 0.245 27.325deg)`<br />Dark: `oklch(63.7% 0.237 25.331deg)` | Destructive foreground. Text and icons on destructive surfaces. |
| `--ds-color-semantic-border` | Light: `oklch(92.2% 0 0deg)`<br />Dark: `oklch(26.9% 0 0deg)` | Interface border. Default dividers and borders. |
| `--ds-color-semantic-input` | Light: `oklch(92.2% 0 0deg)`<br />Dark: `oklch(26.9% 0 0deg)` | Interface input. Field chrome and control backgrounds. |
| `--ds-color-semantic-ring` | Light: `oklch(70.8% 0 0deg)`<br />Dark: `oklch(43.9% 0 0deg)` | Interface ring. Focus outlines and ring states. |
| `--ds-color-semantic-sidebar` | Light: `oklch(98.5% 0 0deg)`<br />Dark: `oklch(20.5% 0 0deg)` | Sidebar surface. Sidebar backgrounds. |
| `--ds-color-semantic-sidebar-foreground` | Light: `oklch(14.5% 0 0deg)`<br />Dark: `oklch(98.5% 0 0deg)` | Sidebar foreground. Text and icons on sidebar surfaces. |
| `--ds-color-semantic-sidebar-primary` | Light: `oklch(20.5% 0 0deg)`<br />Dark: `oklch(48.8% 0.243 264.376deg)` | Sidebar primary surface. Primary emphasis within sidebars. |
| `--ds-color-semantic-sidebar-primary-foreground` | Light: `oklch(98.5% 0 0deg)`<br />Dark: `oklch(98.5% 0 0deg)` | Sidebar primary foreground. Text and icons on sidebar primary surfaces. |
| `--ds-color-semantic-sidebar-accent` | Light: `oklch(97% 0 0deg)`<br />Dark: `oklch(26.9% 0 0deg)` | Sidebar accent surface. Secondary emphasis within sidebars. |
| `--ds-color-semantic-sidebar-accent-foreground` | Light: `oklch(20.5% 0 0deg)`<br />Dark: `oklch(98.5% 0 0deg)` | Sidebar accent foreground. Text and icons on sidebar accent surfaces. |
| `--ds-color-semantic-sidebar-border` | Light: `oklch(92.2% 0 0deg)`<br />Dark: `oklch(26.9% 0 0deg)` | Sidebar border. Sidebar dividers and panel edges. |
| `--ds-color-semantic-sidebar-ring` | Light: `oklch(70.8% 0 0deg)`<br />Dark: `oklch(43.9% 0 0deg)` | Sidebar ring. Focus styles scoped to sidebar controls. |
| `--ds-color-semantic-chart-1` | Light: `oklch(64.6% 0.222 41.116deg)`<br />Dark: `oklch(48.8% 0.243 264.376deg)` | Data series one. Primary chart accent. |
| `--ds-color-semantic-chart-2` | Light: `oklch(60% 0.118 184.704deg)`<br />Dark: `oklch(69.6% 0.17 162.48deg)` | Data series two. Secondary chart accent. |
| `--ds-color-semantic-chart-3` | Light: `oklch(39.8% 0.07 227.392deg)`<br />Dark: `oklch(76.9% 0.188 70.08deg)` | Data series three. Tertiary chart accent. |
| `--ds-color-semantic-chart-4` | Light: `oklch(82.8% 0.189 84.429deg)`<br />Dark: `oklch(62.7% 0.265 303.9deg)` | Data series four. Quaternary chart accent. |
| `--ds-color-semantic-chart-5` | Light: `oklch(76.9% 0.188 70.08deg)`<br />Dark: `oklch(64.5% 0.246 16.439deg)` | Data series five. Quinary chart accent. |

### Status Tokens

Context: `both`

| Token | Value | Usage |
|---|---|---|
| `--ds-color-status-success` | Light: `oklch(78% 0.08 200deg)`<br />Dark: `oklch(28% 0.1 200deg)` | Success state. Positive feedback, confirmations, and success messaging. |
| `--ds-color-status-warning` | Light: `oklch(89% 0.1 75deg)`<br />Dark: `oklch(35% 0.08 70deg)` | Warning state. Cautionary feedback and warning messaging. |
| `--ds-color-status-error` | Light: `oklch(75% 0.15 25deg)`<br />Dark: `oklch(45% 0.1 25deg)` | Error state. Failure feedback and error messaging. |

### Editorial Typography Tokens

Context: `article` / article-first presentation

| Token | Value | Usage |
|---|---|---|
| `--ds-font-family-display` | Default: `var(--font-playfair-display)` | Editorial display serif. Article headlines, pull quotes, and high-emphasis headings. |
| `--ds-font-family-body` | Default: `var(--font-instrument-sans)` | Editorial sans. Body copy, subheads, and general reading text. |
| `--ds-font-family-mono` | Default: `var(--font-dm-mono)` | Editorial mono. Eyebrows, metadata, and technical content. |
| `--ds-font-size-body` | Default: `1.125rem` | Editorial body size. Long-form article copy. |
| `--ds-font-size-lead` | Default: `1.25rem` | Lead copy size. Introductory decks and emphasized prose. |
| `--ds-font-size-heading` | Default: `1.75rem` | Section heading size. Article section headings and strong subheads. |
| `--ds-font-size-hero` | Default: `clamp(2.4rem, 5vw, 3.8rem)` | Editorial hero size. Feature titles and marquee headlines. |
| `--ds-line-height-body` | Default: `1.75` | Standard reading leading. Default prose rhythm for long-form content. |
| `--ds-line-height-relaxed` | Default: `1.8` | Relaxed lead leading. Introductory decks and pull quotes. |
| `--ds-line-height-code` | Default: `1.7` | Code leading. Monospace blocks and technical content. |
| `--ds-line-height-quote` | Default: `1.6` | Quote leading. Pull quotes and emphasized narrative passages. |

### Interface Typography Tokens

Context: `general site`

| Token | Value | Usage |
|---|---|---|
| `--ds-font-family-ui-sans` | Default: `var(--font-geist-sans)` | UI sans. Application chrome and general interface text. |
| `--ds-font-family-ui-mono` | Default: `var(--font-geist-mono)` | UI mono. Interface code, diagnostics, and utility labels. |
| `--ds-font-size-2xs` | Default: `0.625rem` | Micro type size. Dense labels and compact metadata. |
| `--ds-font-size-xs` | Default: `0.75rem` | Small label size. Eyebrows, metadata, and compact controls. |
| `--ds-font-size-sm` | Default: `0.875rem` | Supporting text size. Captions, helper copy, and small UI text. |
| `--ds-font-size-base` | Default: `1rem` | Base UI text size. Default application body copy. |

### Shared Weight And Leading Tokens

Context: `both`

| Token | Value | Usage |
|---|---|---|
| `--ds-font-weight-light` | Default: `300` | Light emphasis weight. Light mono utility text and subtle labels. |
| `--ds-font-weight-regular` | Default: `400` | Regular reading weight. Default body copy and long-form text. |
| `--ds-font-weight-medium` | Default: `500` | Medium emphasis weight. UI labels, subheads, and strong metadata. |
| `--ds-font-weight-bold` | Default: `700` | Bold editorial weight. Headlines and high-emphasis type. |
| `--ds-line-height-tight` | Default: `1.1` | Tight leading. Compact hero headlines and dense title treatments. |
| `--ds-line-height-snug` | Default: `1.25` | Snug leading. Section headings and stacked labels. |

### Spacing Tokens

Context: `both`

| Token | Value | Usage |
|---|---|---|
| `--ds-spacing-0` | Default: `0` | Zero spacing. Remove internal or external whitespace. |
| `--ds-spacing-1` | Default: `0.25rem` | One grid unit. 4px micro spacing and fine alignment. |
| `--ds-spacing-2` | Default: `0.5rem` | Two grid units. 8px compact spacing and minor separation. |
| `--ds-spacing-3` | Default: `0.75rem` | Three grid units. 12px tight component spacing. |
| `--ds-spacing-4` | Default: `1rem` | Four grid units. 16px default UI spacing. |
| `--ds-spacing-5` | Default: `1.25rem` | Five grid units. 20px comfortable control spacing. |
| `--ds-spacing-6` | Default: `1.5rem` | Six grid units. 24px standard section separation. |
| `--ds-spacing-8` | Default: `2rem` | Eight grid units. 32px roomy component spacing. |
| `--ds-spacing-10` | Default: `2.5rem` | Ten grid units. 40px feature spacing and content breaks. |
| `--ds-spacing-12` | Default: `3rem` | Twelve grid units. 48px major section spacing. |
| `--ds-spacing-16` | Default: `4rem` | Sixteen grid units. 64px page-level spacing. |
| `--ds-spacing-20` | Default: `5rem` | Twenty grid units. 80px hero and marquee spacing. |

### Radius Tokens

Context: `both`

| Token | Value | Usage |
|---|---|---|
| `--ds-radius-none` | Default: `0` | No radius. Editorial hard edges and squared treatments. |
| `--ds-radius-xs` | Default: `0.125rem` | Small radius. Inline code and compact element rounding. |
| `--ds-radius-md` | Default: `0.625rem` | Default radius. Shared application card and field rounding. |

### Shadow Tokens

Context: `both`

| Token | Value | Usage |
|---|---|---|
| `--ds-shadow-none` | Default: `none` | No shadow. Flat editorial and interface surfaces. |
| `--ds-shadow-rule` | Default: `0 0 0 1px var(--ds-color-content-rule)` | Rule shadow. Hairline panel edge using the editorial rule color. |

## Typography Scale

| Token | Value | Typical usage |
|---|---|---|
| `--ds-font-size-2xs` | `0.625rem` | Dense labels and compact utility metadata. |
| `--ds-font-size-xs` | `0.75rem` | Eyebrows, bylines, captions, and compact controls. |
| `--ds-font-size-sm` | `0.875rem` | Supporting UI text and helper copy. |
| `--ds-font-size-base` | `1rem` | Default interface copy. |
| `--ds-font-size-body` | `1.125rem` | Long-form article body text. |
| `--ds-font-size-lead` | `1.25rem` | Intro decks and emphasized prose. |
| `--ds-font-size-heading` | `1.75rem` | Article section headings and strong subheads. |
| `--ds-font-size-hero` | `clamp(2.4rem, 5vw, 3.8rem)` | Feature titles and marquee headlines. |

## Spacing Scale

4px base grid. Use the token or the equivalent Tailwind scale value rather than raw spacing values.

| Token | Rem | Px | Typical usage |
|---|---|---|---|
| `--ds-spacing-0` | `0` | `0px` | Reset spacing. |
| `--ds-spacing-1` | `0.25rem` | `4px` | Fine alignment and tight icon gaps. |
| `--ds-spacing-2` | `0.5rem` | `8px` | Compact internal spacing. |
| `--ds-spacing-3` | `0.75rem` | `12px` | Tight component spacing. |
| `--ds-spacing-4` | `1rem` | `16px` | Default UI spacing. |
| `--ds-spacing-5` | `1.25rem` | `20px` | Comfortable control spacing. |
| `--ds-spacing-6` | `1.5rem` | `24px` | Standard section separation. |
| `--ds-spacing-8` | `2rem` | `32px` | Roomy component spacing. |
| `--ds-spacing-10` | `2.5rem` | `40px` | Feature spacing and content breaks. |
| `--ds-spacing-12` | `3rem` | `48px` | Major section spacing. |
| `--ds-spacing-16` | `4rem` | `64px` | Page-level spacing. |
| `--ds-spacing-20` | `5rem` | `80px` | Hero and marquee spacing. |

## UI Primitives

Installed shadcn primitives under `src/components/ui/`. These are the first reusable UI layer to check before creating a custom component.

| Component | Import path | Notes |
|---|---|---|
| `avatar` | `src/components/ui/avatar.tsx` | User/avatar primitive with image and fallback slots. |
| `badge` | `src/components/ui/badge.tsx` | Status and metadata pill with default, secondary, destructive, and outline variants. |
| `button` | `src/components/ui/button.tsx` | Shared button primitive with variant, size, and `asChild` support. |
| `card` | `src/components/ui/card.tsx` | Container primitive with header, content, footer, and description slots. |
| `checkbox` | `src/components/ui/checkbox.tsx` | Radix checkbox wrapper with checked-state icon handling. |
| `dialog` | `src/components/ui/dialog.tsx` | Modal dialog primitive with overlay, content, header, and footer helpers. |
| `input` | `src/components/ui/input.tsx` | Single-line text input primitive with validation styling hooks. |
| `label` | `src/components/ui/label.tsx` | Form label primitive built on Radix label. |
| `pagination` | `src/components/ui/pagination.tsx` | Pagination navigation helpers built on button variants. |
| `select` | `src/components/ui/select.tsx` | Radix select wrapper with trigger, content, item, and scroll helpers. |
| `separator` | `src/components/ui/separator.tsx` | Horizontal or vertical divider primitive. |
| `sheet` | `src/components/ui/sheet.tsx` | Side-drawer primitive built on Radix dialog. |
| `textarea` | `src/components/ui/textarea.tsx` | Multi-line text input primitive with shared field styling. |

## Block Registry

Current block inventory from `design-system/component-index.json` and the live config files under `src/blocks/`. `Type` indicates where the block is currently registered:

- `page`: in `src/collections/Pages/index.ts`
- `article`: in `src/collections/Posts/index.ts`
- `inline`: in `src/blocks/sharedBodyEditor.ts`
- `both`: reused in more than one registration surface

<!-- DS:BLOCKS:START -->
| Slug | Dir | Surfaces | Purpose |
|---|---|---|---|
| `archive` | `ArchiveBlock` | `page` | Displays a hand-picked or filtered archive of posts with optional intro copy. |
| `articleAside` | `ArticleAside` | `inline` | Displays a styled inline aside with an icon and supporting rich text. |
| `articleCallout` | `ArticleCallout` | `inline` | Displays a quoted callout with an optional citation inside article body text. |
| `articleStackGrid` | `ArticleStackGrid` | `inline` | Displays grouped comparison or reference items in a stacked grid within article body text. |
| `banner` | `Banner` | `inline` | Displays an inline status or announcement banner inside article body text. |
| `cta` | `CallToAction` | `page` | Prompts a next action with short rich text and one or more links. |
| `code` | `Code` | `inline` | Displays a syntax-highlighted code sample inside article body text. |
| `content` | `Content` | `page` | Arranges page-level rich text and optional links in configurable editorial columns. |
| `dividerBlock` | `DividerBlock` | `article` | Inserts a simple horizontal divider between article sections. |
| `formBlock` | `Form` | `page` | Embeds a Payload-managed form with optional intro copy and confirmation handling. |
| `mediaBlock` | `MediaBlock` | `page + inline` | Displays a single media asset with an optional rich-text caption. |
| `richTextSection` | `RichTextSection` | `article` | Renders an article section with a heading and long-form rich text. |
| `stepSection` | `StepSection` | `article` | Renders a labeled step section with a heading and rich text body in an article. |
<!-- DS:BLOCKS:END -->

## Block Creation Checklist

When adding a new block:

- [ ] Create `src/blocks/[Name]/config.ts` with the correct `slug`
- [ ] Create `src/blocks/[Name]/Component.tsx` with typed props for the block data
- [ ] Register the block in the correct source: `src/collections/Pages/index.ts`, `src/collections/Posts/index.ts`, or `src/blocks/sharedBodyEditor.ts`
- [ ] Add the render mapping in `src/blocks/RenderBlocks.tsx` or `src/blocks/RenderArticleBlocks.tsx`
- [ ] Run `pnpm generate:types`
- [ ] Run `pnpm ds:index`
- [ ] Update `design-system/SUMMARY.md`
