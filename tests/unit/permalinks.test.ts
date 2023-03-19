import { describe, expect, it } from 'vitest'
import { HANDLED_MASTO_URLS } from '~/constants'

const validPermalinks = [
  'https://m1as-social34.to.social/@elk',
  'https://m1as-social34.to.social/@elk22/123',
  'https://m1as-social34.to.social/@elk22/objects/123',
  'webtoo.ls/@elk',
]

const invalidPermalinks = [
  'https://webtoo.ls',
  'https://webtoo.ls/elk/123',
]

describe('permalinks', () => {
  it.each(validPermalinks)('should recognise %s', (url) => {
    expect(HANDLED_MASTO_URLS.test(url)).toBe(true)
  })
  it.each(invalidPermalinks)('should not recognise %s', (url) => {
    expect(HANDLED_MASTO_URLS.test(url)).toBe(false)
  })
})
