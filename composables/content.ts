import type { Emoji } from 'masto'
import type { DefaultTreeAdapterMap } from 'parse5'
import { parseFragment, serialize } from 'parse5'
import type { VNode } from 'vue'
import { Fragment, h, isVNode } from 'vue'
import { RouterLink } from 'vue-router'
import ContentCode from '~/components/content/ContentCode.vue'
import AccountHoverWrapper from '~/components/account/AccountHoverWrapper.vue'

type Node = DefaultTreeAdapterMap['childNode']
type Element = DefaultTreeAdapterMap['element']

function handleMention(el: Element) {
  // Redirect mentions to the user page
  if (el.tagName === 'a' && el.attrs.find(i => i.name === 'class' && i.value.includes('mention'))) {
    const href = el.attrs.find(i => i.name === 'href')
    if (href) {
      const matchUser = href.value.match(UserLinkRE)
      if (matchUser) {
        const [, server, username] = matchUser
        const handle = `@${username}@${server.replace(/(.+\.)(.+\..+)/, '$2')}`
        href.value = `/${server}/@${username}`
        return h(AccountHoverWrapper, { handle, class: 'inline-block' }, () => nodeToVNode(el))
      }
      const matchTag = href.value.match(TagLinkRE)
      if (matchTag) {
        const [, , name] = matchTag
        href.value = `/${currentServer.value}/tags/${name}`
      }
    }
  }
  return undefined
}

function handleCodeBlock(el: Element) {
  if (el.tagName === 'pre' && el.childNodes[0]?.nodeName === 'code') {
    const codeEl = el.childNodes[0] as Element
    const classes = codeEl.attrs.find(i => i.name === 'class')?.value
    const lang = classes?.split(/\s/g).find(i => i.startsWith('language-'))?.replace('language-', '')
    const code = codeEl.childNodes[0] ? treeToText(codeEl.childNodes[0]) : ''
    return h(ContentCode, { lang, code: encodeURIComponent(code) })
  }
}

function handleNode(el: Element) {
  return handleCodeBlock(el) || handleMention(el) || el
}

/**
 * Parse raw HTML form Mastodon server to AST,
 * with interop of custom emojis and inline Markdown syntax
 */
export function parseMastodonHTML(html: string, customEmojis: Record<string, Emoji> = {}) {
  const processed = html
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

  const tree = parseFragment(processed)

  function walk(node: Node) {
    if ('childNodes' in node)
      node.childNodes = node.childNodes.flatMap(n => walk(n))

    if (node.nodeName === '#text') {
      // @ts-expect-error casing
      const text = node.value as string
      const converted = text
        .replace(/\*\*\*(.*?)\*\*\*/g, '<b><em>$1</em></b>')
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/~~(.*?)~~/g, '<del>$1</del>')
        .replace(/`([^`]+?)`/g, '<code>$1</code>')

      if (converted !== text)
        return parseFragment(converted).childNodes
    }
    return [node]
  }

  tree.childNodes = tree.childNodes.flatMap(n => walk(n))

  return tree
}

export function convertMastodonHTML(html: string, customEmojis: Record<string, Emoji> = {}) {
  const tree = parseMastodonHTML(html, customEmojis)
  return serialize(tree)
}

/**
 * Raw HTML to VNodes
 */
export function contentToVNode(
  content: string,
  customEmojis: Record<string, Emoji> = {},
): VNode {
  const tree = parseMastodonHTML(content, customEmojis)
  return h(Fragment, tree.childNodes.map(n => treeToVNode(n)))
}

function nodeToVNode(node: Node): VNode | string | null {
  if (node.nodeName === '#text') {
    // @ts-expect-error casing
    return input.value as string
  }

  if ('childNodes' in node) {
    const attrs = Object.fromEntries(node.attrs.map(i => [i.name, i.value]))
    if (node.nodeName === 'a' && (attrs.href?.startsWith('/') || attrs.href?.startsWith('.'))) {
      attrs.to = attrs.href
      delete attrs.href
      delete attrs.target
      return h(
        RouterLink as any,
        attrs,
        () => node.childNodes.map(treeToVNode),
      )
    }
    return h(
      node.nodeName,
      attrs,
      node.childNodes.map(treeToVNode),
    )
  }
  return null
}

function treeToVNode(
  input: Node,
): VNode | string | null {
  if (input.nodeName === '#text') {
    // @ts-expect-error casing
    return input.value as string
  }

  if ('childNodes' in input) {
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
  const tree = parseFragment(html)
  return tree.childNodes.map(n => treeToText(n)).join('').trim()
}

export function treeToText(input: Node): string {
  let pre = ''
  let body = ''
  let post = ''

  if (input.nodeName === '#text')
    // @ts-expect-error casing
    return input.value

  if (input.nodeName === 'br')
    return '\n'

  if (['p', 'pre'].includes(input.nodeName))
    pre = '\n'

  if (input.nodeName === 'code') {
    if (input.parentNode?.nodeName === 'pre') {
      const clz = input.attrs.find(attr => attr.name === 'class')
      const lang = clz?.value.replace('language-', '')

      pre = `\`\`\`${lang || ''}\n`
      post = '\n```'
    }
    else {
      pre = '`'
      post = '`'
    }
  }
  else if (input.nodeName === 'b' || input.nodeName === 'strong') {
    pre = '**'
    post = '**'
  }
  else if (input.nodeName === 'i' || input.nodeName === 'em') {
    pre = '*'
    post = '*'
  }
  else if (input.nodeName === 'del') {
    pre = '~~'
    post = '~~'
  }

  if ('childNodes' in input)
    body = input.childNodes.map(n => treeToText(n)).join('')

  if (input.nodeName === 'img' && input.attrs.some(attr => attr.name === 'class' && attr.value.includes('custom-emoji')))
    return `:${input.attrs.find(attr => attr.name === 'data-emoji-id')?.value}:`

  return pre + body + post
}
