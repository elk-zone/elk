import { TEXT_NODE } from 'ultrahtml'
import type { Node } from 'ultrahtml'
import { Fragment, h, isVNode } from 'vue'
import type { VNode } from 'vue'
import { RouterLink } from 'vue-router'
import { decode } from 'tiny-decode'
import type { ContentParseOptions } from './content-parse'
import { parseMastodonHTML } from './content-parse'
import ContentCode from '~/components/content/ContentCode.vue'
import ContentMentionGroup from '~/components/content/ContentMentionGroup.vue'
import AccountHoverWrapper from '~/components/account/AccountHoverWrapper.vue'

/**
* Raw HTML to VNodes
*/
export function contentToVNode(
  content: string,
  options?: ContentParseOptions,
): VNode {
  const tree = parseMastodonHTML(content, options)
  return h(Fragment, (tree.children as Node[] || []).map(n => treeToVNode(n)))
}

function nodeToVNode(node: Node): VNode | string | null {
  if (node.type === TEXT_NODE)
    return node.value

  if (node.name === 'mention-group')
    return h(ContentMentionGroup, node.attributes, () => node.children.map(treeToVNode))

  if ('children' in node) {
    if (node.name === 'a' && (node.attributes.href?.startsWith('/') || node.attributes.href?.startsWith('.'))) {
      node.attributes.to = node.attributes.href
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { href, target, ...attrs } = node.attributes
      return h(
        RouterLink as any,
        attrs,
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
    return decode(input.value)

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

function handleMention(el: Node) {
  // Redirect mentions to the user page
  if (el.name === 'a' && el.attributes.class?.includes('mention')) {
    const href = el.attributes.href
    if (href) {
      const matchUser = href.match(UserLinkRE)
      if (matchUser) {
        const [, server, username] = matchUser
        const handle = `${username}@${server.replace(/(.+\.)(.+\..+)/, '$2')}`
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
