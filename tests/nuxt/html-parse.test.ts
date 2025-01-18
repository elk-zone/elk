import type { ContentParseOptions } from '~/composables/content-parse'
import { format } from 'prettier'
import { render as renderTree } from 'ultrahtml'
import { describe, expect, it } from 'vitest'

describe('html-parse', () => {
  it('empty', async () => {
    const { formatted, serializedText } = await render('')
    expect(formatted).toMatchSnapshot('html')
    expect(serializedText).toMatchSnapshot('text')
  })

  it('link + mention', async () => {
    // https://fosstodon.org/@ayo/109383002937620723
    const { formatted, serializedText } = await render('<p>Happy 🤗 we’re now using <span class="h-card"><a href="https://webtoo.ls/@vitest" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>vitest</span></a></span> (migrated from chai+mocha) <a href="https://github.com/ayoayco/astro-reactive-library/pull/203" rel="nofollow noopener noreferrer" target="_blank"><span class="invisible">https://</span><span class="ellipsis">github.com/ayoayco/astro-react</span><span class="invisible">ive-library/pull/203</span></a></p>')
    expect(formatted).toMatchSnapshot('html')
    expect(serializedText).toMatchSnapshot('text')
  })

  it('custom emoji', async () => {
    const { formatted, serializedText } = await render('Daniel Roe :nuxt:', {
      emojis: {
        nuxt: {
          shortcode: 'nuxt',
          url: 'https://media.webtoo.ls/custom_emojis/images/000/000/366/original/73330dfc9dda4078.png',
          staticUrl: 'https://media.webtoo.ls/custom_emojis/images/000/000/366/original/73330dfc9dda4078.png',
          visibleInPicker: true,
        },
      },
    })
    expect(formatted).toMatchSnapshot('html')
    expect(serializedText).toMatchSnapshot('text')
  })

  it('emojis', async () => {
    const { formatted, serializedText } = await render('🇫🇷 👨‍👩‍👦 👩‍🚒🧑🏽‍🚀')
    expect(formatted).toMatchSnapshot('html')
    expect(serializedText).toMatchSnapshot('text')
  })

  it('code frame', async () => {
    // https://webtoo.ls/@antfu/109396489827394721
    const { formatted, serializedText } = await render('<p>Testing code block</p><p>```ts<br />import { useMouse, usePreferredDark } from &#39;@vueuse/core&#39;</p><p>// tracks mouse position<br />const { x, y } = useMouse()</p><p>// is the user prefers dark theme<br />const isDark = usePreferredDark()<br />```</p>')
    expect(formatted).toMatchSnapshot('html')
    expect(serializedText).toMatchSnapshot('text')
  })

  it('code frame 2', async () => {
    const { formatted, serializedText } = await render('<p><span class=\"h-card\"><a href=\"https://webtoo.ls/@antfu\" class=\"u-url mention\">@<span>antfu</span></a></span> Testing<br />```ts<br />const a = hello<br />```</p>')
    expect(formatted).toMatchSnapshot('html')
    expect(serializedText).toMatchSnapshot('text')
  })

  it('inline markdown', async () => {
    const { formatted, serializedText } = await render('<p>text `code` **bold** *italic* ~~del~~</p><p>```js<br />code block<br />```</p>')
    expect(formatted).toMatchSnapshot('html')
    expect(serializedText).toMatchSnapshot('text')
  })

  it('html entities', async () => {
    const { formatted, serializedText } = await render('<p>Hello &lt;World /&gt;.</p>')
    expect(formatted).toMatchSnapshot('html')
    expect(serializedText).toMatchSnapshot('text')
  })
})

async function render(input: string, options?: ContentParseOptions) {
  const tree = parseMastodonHTML(input, options)
  const html = await renderTree(tree)
  let formatted = ''
  const serializedText = treeToText(tree).trim()

  try {
    formatted = await format(html, {
      parser: 'html',
    })
  }
  catch {
    formatted = html
  }

  return {
    serializedText,
    input,
    tree,
    html,
    formatted,
  }
}
