import { describe, expect, it } from 'vitest'

import { parseComposesWithField, surfacesToLegacyType } from './index-components.mjs'

describe('surfacesToLegacyType', () => {
  it.each([
    [['page'], 'page'],
    [['article'], 'article'],
    [['inline'], 'inline'],
    [['page', 'inline'], 'both'],
    [['page', 'article'], 'both'],
    [[], 'unknown'],
  ])('maps %j to %s', (surfaces, expected) => {
    expect(surfacesToLegacyType(surfaces)).toBe(expected)
  })
})

describe('parseComposesWithField', () => {
  it('returns an empty array when the field is absent', () => {
    expect(parseComposesWithField("export const meta = { slug: 'content' }")).toEqual([])
  })

  it('parses a populated composesWith array', () => {
    expect(
      parseComposesWithField("export const meta = { composesWith: ['mediaBlock', 'archive', 'cta'] }"),
    ).toEqual(['mediaBlock', 'archive', 'cta'])
  })
})
