import type { DefaultTreeAdapterMap } from 'parse5'
import { parseFragment } from 'parse5'
import type { VNode } from 'vue'
import { Fragment, h } from 'vue'
import { RouterLink } from 'vue-router'

type Node = DefaultTreeAdapterMap['childNode']
type Element = DefaultTreeAdapterMap['element']

const UserLinkRE = /^https?:\/\/([^/]+)\/@([^/]+)$/
const TagLinkRE = /^https?:\/\/([^/]+)\/tags\/([^/]+)$/

export function defaultHandle(el: Element) {
  // Redirect mentions to the user page
  if (el.tagName === 'a' && el.attrs.find(i => i.name === 'class' && i.value.includes('mention'))) {
    const href = el.attrs.find(i => i.name === 'href')
    if (href) {
      const matchUser = href.value.match(UserLinkRE)
      if (matchUser) {
        const [, server, username] = matchUser
        href.value = `/@${username}@${server}`
      }
      const matchTag = href.value.match(TagLinkRE)
      if (matchTag) {
        const [, , name] = matchTag
        href.value = `/tags/${name}`
      }
    }
  }
  return el
}

export function contentToVNode(
  content: string,
  handle: (node: Element) => Element | undefined | null | void = defaultHandle,
): VNode {
  const tree = parseFragment(content)
  return h(Fragment, tree.childNodes.map(n => treeToVNode(n, handle)))
}

export function treeToVNode(
  input: Node,
  handle: (node: Element) => Element | undefined | null | void = defaultHandle,
): VNode | string | null {
  if (input.nodeName === '#text')
    // @ts-expect-error casing
    return input.value

  if ('childNodes' in input) {
    const node = handle(input)
    if (node == null)
      return null

    const attrs = Object.fromEntries(node.attrs.map(i => [i.name, i.value]))
    if (node.nodeName === 'a' && (attrs.href?.startsWith('/') || attrs.href?.startsWith('.'))) {
      attrs.to = attrs.href
      delete attrs.href
      delete attrs.target
      return h(
        RouterLink as any,
        attrs,
        node.childNodes.map(n => treeToVNode(n, handle)),
      )
    }
    return h(
      node.nodeName,
      attrs,
      node.childNodes.map(n => treeToVNode(n, handle)),
    )
  }
  return null
}
