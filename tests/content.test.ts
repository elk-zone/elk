import type { Emoji } from 'masto'
import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'
import { contentToVNode } from '~/composables/content'

async function render(content: string, emojis?: Record<string, Emoji>) {
  const vnode = contentToVNode(content, emojis)
  const html = (await renderToString(vnode))
    .replace(/<!--[\[\]]-->/g, '')
  return {
    vnode,
    html,
  }
}

describe('rich-content', () => {
  it('plain', async () => {
    const { html } = await render('Hello\nWorld')
    expect(html).toMatchSnapshot()
  })
})
