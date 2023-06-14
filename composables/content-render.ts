import { TEXT_NODE } from 'ultrahtml'
import type { Node } from 'ultrahtml'
import { Fragment, h, isVNode } from 'vue'
import type { VNode } from 'vue'
import { RouterLink } from 'vue-router'
import { decode } from 'tiny-decode'
import type { mastodon } from 'masto'
import type { ContentParseOptions } from './content-parse'
import { parseMastodonHTML } from './content-parse'
import ContentCode from '~/components/content/ContentCode.vue'
import ContentMentionGroup from '~/components/content/ContentMentionGroup.vue'
import AccountHoverWrapper from '~/components/account/AccountHoverWrapper.vue'

function getTextualAstComponents(astChildren: Node[]): string {
  return astChildren
    .filter(({ type }) => type === TEXT_NODE)
    .map(({ value }) => value)
    .reduce((accumulator, current) => accumulator + current, '')
    .trim()
}

/**
* Raw HTML to VNodes
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

  return h(Fragment, (tree.children as Node[] || []).map(n => treeToVNode(n, options?.status ?? options?.inReplyToStatus)))
}

function nodeToVNode(node: Node, status?: mastodon.v1.Status): VNode | string | null {
  if (node.type === TEXT_NODE)
    return node.value

  if (node.name === 'mention-group')
    return h(ContentMentionGroup, node.attributes, () => node.children.map((n: Node) => treeToVNode(n, status)))

  if ('children' in node) {
    if (node.name === 'a' && (node.attributes.href?.startsWith('/') || node.attributes.href?.startsWith('.'))) {
      node.attributes.to = node.attributes.href

      const { href: _href, target: _target, ...attrs } = node.attributes
      return h(
        RouterLink as any,
        attrs,
        () => node.children.map((n: Node) => treeToVNode(n, status)),
      )
    }
    return h(
      node.name,
      node.attributes,
      node.children.map((n: Node) => treeToVNode(n, status)),
    )
  }
  return null
}

function treeToVNode(
  input: Node,
  status?: mastodon.v1.Status,
): VNode | string | null {
  if (!input)
    return null

  if (input.type === TEXT_NODE)
    return decode(input.value)

  if ('children' in input) {
    const node = handleNode(input, status)
    if (node == null)
      return null
    if (isVNode(node))
      return node
    return nodeToVNode(node, status)
  }
  return null
}

function handleMention(el: Node, status?: mastodon.v1.Status) {
  // Redirect mentions to the user page
  if (el.name === 'a' && el.attributes.class?.includes('mention')) {
    const href = el.attributes.href as string | undefined
    if (href) {
      const matchTag = href.match(TagLinkRE)
      if (matchTag) {
        const [, , name] = matchTag
        el.attributes.href = `/${currentServer.value}/tags/${name}`
      }
      // Only do this if the user is logged in and a tag match failed
      else if (currentUser.value !== undefined) {
        const matchUser = href.match(UserLinkRE)
        if (matchUser) {
          const [, server, username] = matchUser
          const handle = (deriveMentionHandle(href, status) ?? username)
          el.attributes.href = `/${server}/@${handle}`
          return h(AccountHoverWrapper, { handle, class: 'inline-block' }, () => nodeToVNode(el, status))
        }
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

function handleNode(el: Node, status?: mastodon.v1.Status) {
  return handleCodeBlock(el) || handleMention(el, status) || el
}
