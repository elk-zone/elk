import type { mastodon } from 'masto'
import { describe, expect, it } from 'vitest'
import { prependTypedHashtag } from '../../app/composables/tiptap/suggestion'

function tag(name: string): mastodon.v1.Tag {
  return { id: name, name, url: `https://example.com/tags/${name}` }
}

describe('hashtag suggestion', () => {
  it('offers the typed casing first when the server confirms another casing', () => {
    const result = prependTypedHashtag([tag('gamingdeals')], 'GamingDeals')

    expect(result.map(t => t.name)).toEqual(['GamingDeals', 'gamingdeals'])
  })

  it('does not duplicate a hashtag the server already returned verbatim', () => {
    const result = prependTypedHashtag([tag('MastodonMusic'), tag('mastodonmusic')], 'MastodonMusic')

    expect(result.map(t => t.name)).toEqual(['MastodonMusic', 'mastodonmusic'])
  })

  it('leaves prefix matches on other hashtags alone', () => {
    const hashtags = [tag('gamingdeals'), tag('GamingNews')]

    expect(prependTypedHashtag(hashtags, 'Gaming')).toEqual(hashtags)
  })

  it('leaves an empty result set alone so the popup stays closed', () => {
    expect(prependTypedHashtag([], 'BrandNewTag')).toEqual([])
  })
})
