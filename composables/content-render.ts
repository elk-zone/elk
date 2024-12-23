import type { ElementNode, Node } from 'ultrahtml'
import type { VNode } from 'vue'
import type { ContentParseOptions } from './content-parse'
import { decode } from 'tiny-decode'
import { ELEMENT_NODE, TEXT_NODE } from 'ultrahtml'
import { Fragment, h, isVNode } from 'vue'
import { RouterLink } from 'vue-router'
import AccountHoverWrapper from '~/components/account/AccountHoverWrapper.vue'
import TagHoverWrapper from '~/components/account/TagHoverWrapper.vue'
import ContentCode from '~/components/content/ContentCode.vue'
import ContentMentionGroup from '~/components/content/ContentMentionGroup.vue'
import Emoji from '~/components/emoji/Emoji.vue'
import { parseMastodonHTML } from './content-parse'

function getTextualAstComponents(astChildren: Node[]): string {
  return astChildren
    .filter(({ type }) => type === TEXT_NODE)
    .map(({ value }) => value)
    .reduce((accumulator, current) => accumulator + current, '')
    .trim()
}

/**
 * Raw HTML to VNodes.
 *
 * @param content HTML content.
 * @param options Options.
 */
export function contentToVNode(
  content: string,
  options?: ContentParseOptions,
): VNode {
  let tree = parseMastodonHTML(content, options)

  const textContents = getTextualAstComponents(tree.children)

  // if the username only contains emojis, we should probably show the emojis anyway to avoid a blank name
  if (options?.hideEmojis && textContents.length === 0)
    tree = parseMastodonHTML(content, { ...options, hideEmojis: false })

  return h(Fragment, (tree.children as Node[] || []).map(n => treeToVNode(n)))
}

export function nodeToVNode(node: Node): VNode | string | null {
  if (node.type === TEXT_NODE)
    return node.value

  if (node.name === 'mention-group')
    return h(ContentMentionGroup, node.attributes, () => node.children.map(treeToVNode))

  // add tooltip to emojis
  if (node.name === 'picture' || (node.name === 'img' && node.attributes?.alt)) {
    const props = node.attributes ?? {}
    props.as = node.name
    return h(
      Emoji,
      props,
      () => node.children.map(treeToVNode),
    )
  }

  if ('children' in node) {
    if (node.name === 'a' && (node.attributes.href?.startsWith('/') || node.attributes.href?.startsWith('.'))) {
      node.attributes.to = node.attributes.href

      const { href: _href, target: _target, ...attrs } = node.attributes
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
  if (!input)
    return null

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

function addBdiNode(node: Node) {
  if (node.children.length === 1 && node.children[0].type === ELEMENT_NODE && node.children[0].name === 'bdi')
    return

  const children = node.children.splice(0, node.children.length)
  const bdi = {
    name: 'bdi',
    parent: node,
    loc: node.loc,
    type: ELEMENT_NODE,
    attributes: {},
    children,
  } satisfies ElementNode
  children.forEach((n: Node) => n.parent = bdi)
  node.children.push(bdi)
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
        addBdiNode(el)
        return h(AccountHoverWrapper, { handle, class: 'inline-block' }, () => nodeToVNode(el))
      }

      const matchTag = href.match(TagLinkRE)
      if (matchTag) {
        const [, , tagName] = matchTag
        addBdiNode(el)
        el.attributes.href = `/${currentServer.value}/tags/${tagName}`
        return h(TagHoverWrapper, { tagName, class: 'inline-block' }, () => nodeToVNode(el))
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
    const code = (codeEl.children && codeEl.children.length > 0)
      ? recursiveTreeToText(codeEl)
      : ''
    return h(ContentCode, { lang, code: encodeURIComponent(code) })
  }
}

function handleNode(el: Node) {
  return handleCodeBlock(el) || handleMention(el) || el
}
