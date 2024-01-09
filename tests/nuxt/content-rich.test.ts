import { describe, expect, it, vi } from 'vitest'
import { renderToString } from 'vue/server-renderer'
import { format } from 'prettier'
import type { mastodon } from 'masto'
import { mockComponent } from '@nuxt/test-utils/runtime'
import { contentToVNode } from '~/composables/content-render'
import type { ContentParseOptions } from '~/composables/content-parse'

describe('content-rich', () => {
  it('empty', async () => {
    const { formatted } = await render('')
    expect(formatted).toMatchSnapshot()
  })

  it('plain text', async () => {
    const { formatted } = await render('hello there', { collapseMentionLink: true })
    expect(formatted).toMatchSnapshot()
  })

  it('link + mention', async () => {
    // https://fosstodon.org/@ayo/109383002937620723
    const { formatted } = await render('<p>Happy 🤗 we’re now using <span class="h-card"><a href="https://webtoo.ls/@vitest" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>vitest</span></a></span> (migrated from chai+mocha) <a href="https://github.com/ayoayco/astro-reactive-library/pull/203" rel="nofollow noopener noreferrer" target="_blank"><span class="invisible">https://</span><span class="ellipsis">github.com/ayoayco/astro-react</span><span class="invisible">ive-library/pull/203</span></a></p>')
    expect(formatted).toMatchSnapshot()
  })

  it ('block with backticks', async () => {
    const { formatted } = await render('<p>```<br />[(`number string) (`tag string)]<br />```</p>')
    expect(formatted).toMatchSnapshot()
  })

  it('group mention', async () => {
    const { formatted } = await render('<p><span class="h-card"><a href="https://lemmy.ml/c/pilipinas" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>pilipinas</span></a></span></p>', {
      mentions: [{ id: '', username: 'pilipinas', url: 'https://lemmy.ml/c/pilipinas', acct: 'pilipinas@lemmy.ml' }],
    })
    expect(formatted).toMatchSnapshot('html')
  })

  it('inline code with link', async () => {
    const { formatted } = await render('<p>Inline code with link: `<a href="https://api.iconify.design/noto.css?icons=1st-place-medal,2nd-place-medal" target="_blank" rel="nofollow noopener noreferrer" class="status-link unhandled-link" title="https://api.iconify.design/noto.css?icons=1st-place-medal,2nd-place-medal"><span class="invisible">https://</span><span class="ellipsis">api.iconify.design/noto.css?ic</span><span class="invisible">ons=1st-place-medal,2nd-place-medal</span></a>`</p>')
    expect(formatted).toMatchSnapshot()
  })

  it('handles html within code blocks', async () => {
    const { formatted } = await render('<p>HTML block code:<br>```html<br>&lt;span class="icon--noto icon--noto--1st-place-medal"&gt;&lt;/span&gt;<br>&lt;span class="icon--noto icon--noto--2nd-place-medal-medal"&gt;&lt;/span&gt;<br>```</p>')
    expect(formatted).toMatchSnapshot()
  })

  it('handles formatting from servers', async () => {
    const { formatted } = await render('<h1>Fedi HTML Support Survey</h1><p>Does the following formatting come through accurately for you?</p><ul><li>This is an indented bulleted list (not just asterisks).</li><li><strong>This line is bold.</strong></li><li><em>This line is italic.</em></li></ul><ol><li>This list...</li><li>...is numbered and indented</li></ol><h1>This line is larger.</h1>')
    expect(formatted).toMatchSnapshot()
  })

  it('custom emoji', async () => {
    const { formatted } = await render('Daniel Roe :nuxt:', {
      emojis: {
        nuxt: {
          shortcode: 'nuxt',
          url: 'https://media.webtoo.ls/custom_emojis/images/000/000/366/original/73330dfc9dda4078.png',
          staticUrl: 'https://media.webtoo.ls/custom_emojis/images/000/000/366/original/73330dfc9dda4078.png',
          visibleInPicker: true,
        },
      },
    })
    expect(formatted).toMatchSnapshot()
  })

  it('code frame', async () => {
    // https://webtoo.ls/@antfu/109396489827394721
    const { formatted } = await render('<p>Testing code block</p><p>```ts<br />import { useMouse, usePreferredDark } from &#39;@vueuse/core&#39;</p><p>// tracks mouse position<br />const { x, y } = useMouse()</p><p>// is the user prefers dark theme<br />const isDark = usePreferredDark()<br />```</p>')
    expect(formatted).toMatchSnapshot()
  })

  it('code frame 2', async () => {
    const { formatted } = await render('<p><span class=\"h-card\"><a href=\"https://webtoo.ls/@antfu\" class=\"u-url mention\">@<span>antfu</span></a></span> Testing<br />```ts<br />const a = hello<br />```</p>')
    expect(formatted).toMatchSnapshot()
  })

  it('code frame no lang', async () => {
    const { formatted } = await render('<p>```<br />hello world<br />```<br />no lang</p>')
    expect(formatted).toMatchSnapshot()
  })

  it('code frame empty', async () => {
    const { formatted } = await render('<p>```<br /><br />```<br /></p>')
    expect(formatted).toMatchSnapshot()
  })

  it('collapse mentions', async () => {
    const { formatted } = await render('<p><span class="h-card"><a href="https://m.webtoo.ls/@elk" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>elk</span></a></span> <span class="h-card"><a href="https://m.webtoo.ls/@elk" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>elk</span></a></span> content <span class="h-card"><a href="https://m.webtoo.ls/@antfu" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>antfu</span></a></span> <span class="h-card"><a href="https://mastodon.roe.dev/@daniel" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>daniel</span></a></span> <span class="h-card"><a href="https://m.webtoo.ls/@sxzz" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>sxzz</span></a></span> <span class="h-card"><a href="https://m.webtoo.ls/@patak" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>patak</span></a></span> content</p>', {
      collapseMentionLink: true,
    })
    expect(formatted).toMatchSnapshot()
  })

  it('hides collapsed mentions', async () => {
    const { formatted } = await render('<p><span class="h-card"><a href="https://m.webtoo.ls/@elk" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>elk</span></a></span> content</p>', {
      collapseMentionLink: true,
      inReplyToStatus: { account: { acct: 'elk@webtoo.ls' }, mentions: [] as mastodon.v1.StatusMention[] } as mastodon.v1.Status,
    })
    expect(formatted).toMatchSnapshot()
  })

  it('shows some collapsed mentions inline', async () => {
    const { formatted } = await render('<p><span class="h-card"><a href="https://m.webtoo.ls/@elk" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>elk</span></a></span> <span class="h-card"><a href="https://m.webtoo.ls/@antfu" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>antfu</span></a></span> content</p>', {
      collapseMentionLink: true,
      inReplyToStatus: { account: { acct: 'elk@webtoo.ls' }, mentions: [] as mastodon.v1.StatusMention[] } as mastodon.v1.Status,
    })
    expect(formatted).toMatchSnapshot()
  })

  it('shows some collapsed mentions grouped', async () => {
    const { formatted } = await render('<p><span class="h-card"><a href="https://m.webtoo.ls/@elk" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>elk</span></a></span> <span class="h-card"><a href="https://m.webtoo.ls/@antfu" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>antfu</span></a></span> <span class="h-card"><a href="https://m.webtoo.ls/@patak" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>patak</span></a></span> <span class="h-card"><a href="https://m.webtoo.ls/@sxzz" class="u-url mention" rel="nofollow noopener noreferrer" target="_blank">@<span>sxzz</span></a></span>content</p>', {
      collapseMentionLink: true,
      inReplyToStatus: { account: { acct: 'elk@webtoo.ls' }, mentions: [] as mastodon.v1.StatusMention[] } as mastodon.v1.Status,
    })
    expect(formatted).toMatchSnapshot()
  })

  it ('block with injected html, without language', async () => {
    const { formatted } = await render(`
      <pre>
        <code>
          &lt;a href="javascript:alert(1)">click me&lt;/a>
        </code>
      </pre>
    `)
    expect(formatted).toMatchSnapshot()
  })

  it ('block with injected html, with an unknown language', async () => {
    const { formatted } = await render(`
      <pre>
        <code class="language-xyzzy">
          &lt;a href="javascript:alert(1)">click me&lt;/a>
        </code>
      </pre>
    `)
    expect(formatted).toMatchSnapshot()
  })

  it ('block with injected html, with a known language', async () => {
    const { formatted } = await render(`
      <pre>
        <code class="language-js">
          &lt;a href="javascript:alert(1)">click me&lt;/a>
        </code>
      </pre>
    `)
    expect(formatted).toMatchSnapshot()
  })

  it ('hashtag adds bdi', async () => {
    const { formatted } = await render(`
      <p>Testing bdi is added <a href="https://universeodon.com/tags/turkey" class="mention hashtag" rel="tag">#<span>turkey</span></a></p>
    `)
    expect(formatted).toMatchSnapshot()
  })

  // REVIEW: there is something wrong with this test in the rendered output, missing bdi content, ultrahtml parses it correctly
  it ('hashtag doesn\'t add 2 bdi', async () => {
    const { formatted } = await render(`
      <p>Testing bdi not added <a href="https://universeodon.com/tags/turkey" class="mention hashtag" rel="tag"><bdi>#<span>turkey</span></bdi></a></p>
    `)
    expect(formatted).toMatchSnapshot()
  })
})

describe('editor', () => {
  it('transform mentions', () => {
    const ast = parseMastodonHTML('<p><span class="h-card"><a href="https://m.webtoo.ls/@elk" class="u-url mention">@<span>elk</span></a></span> Hello</p>')
    const transformed = treeToText(ast)
    expect(transformed).toMatchSnapshot()
  })
})

async function render(content: string, options?: ContentParseOptions) {
  const vnode = contentToVNode(content, options)
  const html = (await renderToString(vnode))
    .replace(/<!--[\[\]]-->/g, '')
  let formatted = ''

  try {
    formatted = await format(html, {
      parser: 'html',
    })
  }
  catch (e) {
    formatted = html
  }

  return {
    vnode,
    html,
    formatted,
  }
}

// mocks
vi.mock('vue-router', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    RouterLink: defineComponent({
      setup(props, { slots }) {
        return () => h('a', props, { default: () => slots?.default?.() })
      },
    }),
  }
})

mockComponent('ContentMentionGroup', {
  setup(props, { slots }) {
    return () => h('mention-group', null, { default: () => slots?.default?.() })
  },
})

mockComponent('AccountHoverWrapper', {
  props: ['handle', 'class'],
  setup(_, { slots }) {
    return () => slots?.default?.()
  },
})
