import type { Emoji } from 'masto'
import type { DefaultTreeAdapterMap } from 'parse5'
import { parseFragment } from 'parse5'
import type { Component, VNode } from 'vue'
import { Fragment, h, isVNode } from 'vue'
import { RouterLink } from 'vue-router'
import ContentCode from '~/components/content/ContentCode.vue'

type Node = DefaultTreeAdapterMap['childNode']
type Element = DefaultTreeAdapterMap['element']

const CUSTOM_BLOCKS: Record<string, Component> = {
  'custom-code': ContentCode,
}

function handleMention(el: Element) {
  // Redirect mentions to the user page
  if (el.tagName === 'a' && el.attrs.find(i => i.name === 'class' && i.value.includes('mention'))) {
    const href = el.attrs.find(i => i.name === 'href')
    if (href) {
      const matchUser = href.value.match(UserLinkRE)
      if (matchUser) {
        const [, server, username] = matchUser
        // Handles need to ignore server subdomains
        href.value = `/@${username}@${server.replace(/(.+\.)(.+\..+)/, '$2')}`
      }
      const matchTag = href.value.match(TagLinkRE)
      if (matchTag) {
        const [, , name] = matchTag
        href.value = `/tags/${name}`
      }
    }
  }
  return undefined
}

function handleBlocks(el: Element) {
  if (el.tagName in CUSTOM_BLOCKS) {
    const block = CUSTOM_BLOCKS[el.tagName]
    const attrs = Object.fromEntries(el.attrs.map(i => [i.name, i.value]))
    return h(block, attrs, () => el.childNodes.map(treeToVNode))
  }
}

function handleNode(el: Element) {
  return handleBlocks(el) || handleMention(el) || el
}

export function contentToVNode(
  content: string,
  customEmojis: Record<string, Emoji> = {},
): VNode {
  content = content
    .trim()
    // handle custom emojis
    .replace(/:([\w-]+?):/g, (_, name) => {
      const emoji = customEmojis[name]
      if (emoji)
        return `<img src="${emoji.url}" alt="${name}" class="custom-emoji" />`
      return `:${name}:`
    })
    // handle code frames
    .replace(/<p>(```|~~~)([\s\S]+?)\1/g, (_1, _2, raw) => {
      const plain = htmlToText(`<p>${raw}</p>`).trim()
      const [lang, ...rest] = plain.split(/\n/)
      return `<custom-code lang="${lang?.trim().toLowerCase() || ''}" code="${encodeURIComponent(rest.join('\n'))}"></custom-code>`
    })

  const tree = parseFragment(content)
  return h(Fragment, tree.childNodes.map(n => treeToVNode(n)))
}

export function treeToVNode(
  input: Node,
): VNode | string | null {
  if (input.nodeName === '#text')
    // @ts-expect-error casing
    return input.value

  if ('childNodes' in input) {
    const node = handleNode(input)
    if (node == null)
      return null
    if (isVNode(node))
      return node

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

export function htmlToText(html: string) {
  const tree = parseFragment(html)
  return tree.childNodes.map(n => treeToText(n)).join('').trim()
}

function treeToText(input: Node): string {
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
    pre = '````\n'
    post = '\n```'
  }

  if ('childNodes' in input)
    body = input.childNodes.map(n => treeToText(n)).join('')

  return pre + body + post
}
