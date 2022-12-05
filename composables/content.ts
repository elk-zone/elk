import type { Emoji } from 'masto'
import type { Node } from 'ultrahtml'
import { TEXT_NODE, parse, render, walkSync } from 'ultrahtml'
import type { VNode } from 'vue'
import { Fragment, h, isVNode } from 'vue'
import { RouterLink } from 'vue-router'
import ContentCode from '~/components/content/ContentCode.vue'
import AccountHoverWrapper from '~/components/account/AccountHoverWrapper.vue'

function handleMention(el: Node) {
  // Redirect mentions to the user page
  if (el.name === 'a' && el.attributes.class?.includes('mention')) {
    const href = el.attributes.href
    if (href) {
      const matchUser = href.match(UserLinkRE)
      if (matchUser) {
        const [, server, username] = matchUser
        const handle = `@${username}@${server.replace(/(.+\.)(.+\..+)/, '$2')}`
        el.attributes.href = `/${server}/@${username}`
        return h(AccountHoverWrapper, { handle, class: 'inline-block' }, () => nodeToVNode(el))
      }
      const matchTag = href.match(TagLinkRE)
      if (matchTag) {
        const [, , name] = matchTag
        el.attributes.href = `/${currentServer.value}/tags/${name}`
      }
    }
  }
  return undefined
}

function handleCodeBlock(el: Node) {
  if (el.name === 'pre' && el.children[0]?.name === 'code') {
    const codeEl = el.children[0] as Node
    const classes = codeEl.attributes.class as string
    const lang = classes?.split(/\s/g).find(i => i.startsWith('language-'))?.replace('language-', '')
    const code = codeEl.children[0] ? treeToText(codeEl.children[0]) : ''
    return h(ContentCode, { lang, code: encodeURIComponent(code) })
  }
}

function handleNode(el: Node) {
  return handleCodeBlock(el) || handleMention(el) || el
}

/**
 * Parse raw HTML form Mastodon server to AST,
 * with interop of custom emojis and inline Markdown syntax
 */
export function parseMastodonHTML(html: string, customEmojis: Record<string, Emoji> = {}) {
  let processed = html
    // custom emojis
    .replace(/:([\w-]+?):/g, (_, name) => {
      const emoji = customEmojis[name]
      if (emoji)
        return `<img src="${emoji.url}" alt=":${name}:" class="custom-emoji" data-emoji-id="${name}" />`
      return `:${name}:`
    })
    // handle code blocks
    .replace(/>(```|~~~)(\w*)([\s\S]+?)\1/g, (_1, _2, lang, raw) => {
      const code = htmlToText(raw)
      const classes = lang ? ` class="language-${lang}"` : ''
      return `><pre><code${classes}>${code}</code></pre>`
    })

  walkSync(parse(processed), (node) => {
    if (node.type !== TEXT_NODE)
      return
    const replacements = [
      [/\*\*\*(.*?)\*\*\*/g, '<b><em>$1</em></b>'],
      [/\*\*(.*?)\*\*/g, '<b>$1</b>'],
      [/\*(.*?)\*/g, '<em>$1</em>'],
      [/~~(.*?)~~/g, '<del>$1</del>'],
      [/`([^`]+?)`/g, '<code>$1</code>'],
      [/&#(\d+);/g, (_: string, dec: string) => String.fromCharCode(Number(dec))],
    ] as any

    for (const [re, replacement] of replacements) {
      for (const match of node.value.matchAll(re)) {
        if (node.loc) {
          const start = match.index! + node.loc[0].start
          const end = start + match[0].length + node.loc[0].start
          processed = processed.slice(0, start) + match[0].replace(re, replacement) + processed.slice(end)
        }
        else {
          processed = processed.replace(match[0], match[0].replace(re, replacement))
        }
      }
    }
  })

  return parse(processed)
}

export async function convertMastodonHTML(html: string, customEmojis: Record<string, Emoji> = {}) {
  const tree = parseMastodonHTML(html, customEmojis)
  return await render(tree)
}

/**
 * Raw HTML to VNodes
 */
export function contentToVNode(
  content: string,
  customEmojis: Record<string, Emoji> = {},
): VNode {
  const tree = parseMastodonHTML(content, customEmojis)
  return h(Fragment, (tree.children as Node[]).map(n => treeToVNode(n)))
}

function nodeToVNode(node: Node): VNode | string | null {
  if (node.type === TEXT_NODE)
    return node.value

  if ('children' in node) {
    if (node.name === 'a' && (node.attributes.href?.startsWith('/') || node.attributes.href?.startsWith('.'))) {
      node.attributes.to = node.attributes.href
      delete node.attributes.href
      delete node.attributes.target
      return h(
        RouterLink as any,
        node.attributes,
        () => node.children.map(treeToVNode),
      )
    }
    return h(
      node.name,
      node.attributes,
      node.children.map(treeToVNode),
    )
  }
  return null
}

function treeToVNode(
  input: Node,
): VNode | string | null {
  if (input.type === TEXT_NODE)
    return input.value as string

  if ('children' in input) {
    const node = handleNode(input)
    if (node == null)
      return null
    if (isVNode(node))
      return node
    return nodeToVNode(node)
  }
  return null
}

export function htmlToText(html: string) {
  const tree = parse(html)
  return (tree.children as Node[]).map(n => treeToText(n)).join('').trim()
}

export function treeToText(input: Node): string {
  let pre = ''
  let body = ''
  let post = ''

  if (input.type === TEXT_NODE)
    return input.value

  if (input.name === 'br')
    return '\n'

  if (['p', 'pre'].includes(input.name))
    pre = '\n'

  if (input.name === 'code') {
    if (input.parent?.name === 'pre') {
      const lang = input.attributes.class?.replace('language-', '')

      pre = `\`\`\`${lang || ''}\n`
      post = '\n```'
    }
    else {
      pre = '`'
      post = '`'
    }
  }
  else if (input.name === 'b' || input.name === 'strong') {
    pre = '**'
    post = '**'
  }
  else if (input.name === 'i' || input.name === 'em') {
    pre = '*'
    post = '*'
  }
  else if (input.name === 'del') {
    pre = '~~'
    post = '~~'
  }

  if ('children' in input)
    body = (input.children as Node[]).map(n => treeToText(n)).join('')

  if (input.name === 'img' && input.attributes.class?.includes('custom-emoji'))
    return `:${input.attributes['data-emoji-id']}:`

  return pre + body + post
}
