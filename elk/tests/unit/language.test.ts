import { describe, expect, it } from 'vitest'
import { matchLanguages } from '../../app/utils/language'

describe('language', () => {
  it('match language', () => {
    expect(matchLanguages(['zh-CN', 'zh-TW'], ['zh'])).toMatchInlineSnapshot('"zh-CN"')
    expect(matchLanguages(['zh-CN', 'zh-TW'], ['en'])).toMatchInlineSnapshot('null')

    expect(matchLanguages(['zh-CN', 'zh-TW', 'en-US'], ['zh', 'en'])).toMatchInlineSnapshot('"zh-CN"')
    expect(matchLanguages(['zh-CN', 'zh-TW', 'en-US'], ['en', 'zh-CN'])).toMatchInlineSnapshot('"en-US"')
    expect(matchLanguages(['zh-CN', 'zh-TW', 'en-US'], ['zh-TW', 'en'])).toMatchInlineSnapshot('"zh-TW"')

    expect(matchLanguages(['zh-TW', 'en-US'], ['zh-CN', 'en-GB'])).toMatchInlineSnapshot('"zh-TW"')
    expect(matchLanguages(['zh-TW', 'en-GB'], ['ja-JP', 'zh-CN'])).toMatchInlineSnapshot('"zh-TW"')

    expect(matchLanguages(['zh-TW'], ['zh-tw'])).toMatchInlineSnapshot('"zh-TW"')
  })
})
