// @unimport-disable
import type { mastodon } from 'masto'
import type { Node } from 'ultrahtml'
import { findAndReplaceEmojisInText } from '@iconify/utils'
import { decode } from 'tiny-decode'
import { DOCUMENT_NODE, ELEMENT_NODE, h, parse, render, TEXT_NODE } from 'ultrahtml'
import { emojiRegEx, getEmojiAttributes } from '../config/emojis'

export interface ContentParseOptions {
  emojis?: Record<string, mastodon.v1.CustomEmoji>
  hideEmojis?: boolean
  mentions?: mastodon.v1.StatusMention[]
  markdown?: boolean
  replaceUnicodeEmoji?: boolean
  astTransforms?: Transform[]
  convertMentionLink?: boolean
  collapseMentionLink?: boolean
  status?: mastodon.v1.Status
  inReplyToStatus?: mastodon.v1.Status
}

const sanitizerBasicClasses = filterClasses(/^h-\S*|p-\S*|u-\S*|dt-\S*|e-\S*|mention|hashtag|ellipsis|invisible$/u)
const sanitizer = sanitize({
  // Allow basic elements as seen in https://github.com/mastodon/mastodon/blob/17f79082b098e05b68d6f0d38fabb3ac121879a9/lib/sanitize_ext/sanitize_config.rb
  br: {},
  p: {},
  a: {
    href: filterHref(),
    class: sanitizerBasicClasses,
    rel: set('nofollow noopener noreferrer'),
    target: set('_blank'),
  },
  span: {
    class: sanitizerBasicClasses,
  },
  // Allow elements potentially created for Markdown code blocks above
  pre: {},
  code: {
    class: filterClasses(/^language-\w+$/),
  },
  // Other elements supported in glitch, as seen in
  // https://github.com/glitch-soc/mastodon/blob/13227e1dafd308dfe1a3effc3379b766274809b3/lib/sanitize_ext/sanitize_config.rb#L75
  abbr: {
    title: keep,
  },
  del: {},
  blockquote: {
    cite: filterHref(),
  },
  b: {},
  strong: {},
  u: {},
  sub: {},
  sup: {},
  i: {},
  em: {},
  h1: {},
  h2: {},
  h3: {},
  h4: {},
  h5: {},
  ul: {},
  ol: {
    start: keep,
    reversed: keep,
  },
  li: {
    value: keep,
  },
})

/**
 * Parse raw HTML form Mastodon server to AST,
 * with interop of custom emojis and inline Markdown syntax
 * @param html The content to parse
 * @param options The parsing options
 */
export function parseMastodonHTML(
  html: string,
  options: ContentParseOptions = {},
) {
  const {
    markdown = true,
    replaceUnicodeEmoji = true,
    convertMentionLink = false,
    collapseMentionLink = false,
    hideEmojis = false,
    mentions,
    status,
    inReplyToStatus,
  } = options

  // remove newline before Tags
  html = html.replace(/\n(<[^>]+>)/g, (_1, raw) => {
    return raw
  })

  if (markdown) {
    // Handle code blocks
    html = html
      /* eslint-disable regexp/no-super-linear-backtracking, regexp/no-misleading-capturing-group */
      .replace(/>(```|~~~)(\w*)([\s\S]+?)\1/g, (_1, _2, lang: string, raw: string) => {
        const code = htmlToText(raw)
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/`/g, '&#96;')
        const classes = lang ? ` class="language-${lang}"` : ''
        return `><pre><code${classes}>${code}</code></pre>`
      })
      .replace(/`([^`\n]*)`/g, (_1, raw) => {
        return raw ? `<code>${htmlToText(raw).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>` : ''
      })
  }

  // Always sanitize the raw HTML data *after* it has been modified
  const transforms: Transform[] = [
    sanitizer,
    ...options.astTransforms || [],
  ]

  if (hideEmojis) {
    transforms.push(removeUnicodeEmoji)
    transforms.push(removeCustomEmoji(options.emojis ?? {}))
  }
  else {
    if (replaceUnicodeEmoji)
      transforms.push(transformUnicodeEmoji)

    transforms.push(replaceCustomEmoji(options.emojis ?? {}))
  }

  if (markdown)
    transforms.push(transformMarkdown)

  if (mentions?.length)
    transforms.push(createTransformNamedMentions(mentions))

  if (convertMentionLink)
    transforms.push(transformMentionLink)

  transforms.push(transformParagraphs)

  if (collapseMentionLink)
    transforms.push(transformCollapseMentions(status, inReplyToStatus))

  return transformSync(parse(html), transforms)
}

/**
 * Converts raw HTML form Mastodon server to HTML for Tiptap editor
 * @param html The content to parse
 * @param customEmojis The custom emojis to use
 */
export function convertMastodonHTML(html: string, customEmojis: Record<string, mastodon.v1.CustomEmoji> = {}) {
  const tree = parseMastodonHTML(html, {
    emojis: customEmojis,
    markdown: true,
    convertMentionLink: true,
  })
  return render(tree)
}

export function sanitizeEmbeddedIframe(html: string): Node {
  const transforms: Transform[] = [
    sanitize({
      iframe: {
        src: (src) => {
          if (typeof src !== 'string')
            return undefined

          const url = new URL(src)
          return url.protocol === 'https:' ? src : undefined
        },
        allowfullscreen: set('true'),
      },
    }),
  ]

  return transformSync(parse(html), transforms)
}

export function htmlToText(html: string) {
  try {
    const tree = parse(html)
    return (tree.children as Node[]).map(n => treeToText(n)).join('').trim()
  }
  catch (err) {
    console.error(err)
    return ''
  }
}

export function recursiveTreeToText(input: Node): string {
  if (input && input.children && input.children.length > 0)
    return input.children.map((n: Node) => recursiveTreeToText(n)).join('')
  else
    return treeToText(input)
}

const emojiIdNeedsWrappingRE = /^([\w\-])+$/

export function treeToText(input: Node): string {
  let pre = ''
  let body = ''
  let post = ''

  if (input.type === TEXT_NODE)
    return decode(input.value)

  if (input.name === 'br')
    return '\n'

  if (['p', 'pre'].includes(input.name))
    pre = '\n'

  if (input.attributes?.['data-type'] === 'mention') {
    const acct = input.attributes['data-id']
    if (acct)
      return acct.startsWith('@') ? acct : `@${acct}`
  }

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

  if (input.name === 'img' || input.name === 'picture') {
    if (input.attributes.class?.includes('custom-emoji')) {
      const id = input.attributes['data-emoji-id'] ?? input.attributes.alt ?? input.attributes.title ?? 'unknown'
      return id.match(emojiIdNeedsWrappingRE) ? `:${id}:` : id
    }
    if (input.attributes.class?.includes('iconify-emoji'))
      return input.attributes.alt
  }

  return pre + body + post
}

// A tree transform function takes an ultrahtml Node object and returns
// new content that will replace the given node in the tree.
// Returning a null removes the node from the tree.
// Strings get converted to text nodes.
// The input node's children have been transformed before the node itself
// gets transformed.
type Transform = (node: Node, root: Node) => (Node | string)[] | Node | string | null

// Helpers for transforming (filtering, modifying, ...) a parsed HTML tree
// by running the given chain of transform functions one-by-one.
function transformSync(doc: Node, transforms: Transform[]) {
  function visit(node: Node, transform: Transform, root: Node) {
    if (Array.isArray(node.children)) {
      const children = [] as (Node | string)[]
      for (let i = 0; i < node.children.length; i++) {
        const result = visit(node.children[i], transform, root)
        if (Array.isArray(result))
          children.push(...result)

        else if (result)
          children.push(result)
      }

      node.children = children.map((value) => {
        if (typeof value === 'string')
          return { type: TEXT_NODE, value, parent: node }
        value.parent = node
        return value
      })
    }
    return transform(node, root)
  }

  for (const transform of transforms)
    doc = visit(doc, transform, doc) as Node

  return doc
}

// A tree transform for sanitizing elements & their attributes.
type AttrSanitizers = Record<string, (value: string | undefined) => string | undefined>
function sanitize(allowedElements: Record<string, AttrSanitizers>): Transform {
  return (node) => {
    if (node.type !== ELEMENT_NODE)
      return node

    if (!Object.prototype.hasOwnProperty.call(allowedElements, node.name))
      return null

    const attrSanitizers = allowedElements[node.name]
    const attrs = {} as Record<string, string>
    for (const [name, func] of Object.entries(attrSanitizers)) {
      const value = func(node.attributes[name])
      if (value !== undefined)
        attrs[name] = value
    }
    node.attributes = attrs
    return node
  }
}

function filterClasses(allowed: RegExp) {
  return (c: string | undefined) => {
    if (!c)
      return undefined

    return c.split(/\s/g).filter(cls => allowed.test(cls)).join(' ')
  }
}

function keep(value: string | undefined) {
  return value
}

function set(value: string) {
  return () => value
}

function filterHref() {
  const LINK_PROTOCOLS = new Set([
    'http:',
    'https:',
    'dat:',
    'dweb:',
    'ipfs:',
    'ipns:',
    'ssb:',
    'gopher:',
    'xmpp:',
    'magnet:',
    'gemini:',
  ])

  return (href: string | undefined) => {
    if (href === undefined)
      return undefined

    // Allow relative links
    if (href.startsWith('/') || href.startsWith('.'))
      return href

    href = href.replace(/&amp;/g, '&')

    let url
    try {
      url = new URL(href)
    }
    catch (err) {
      if (err instanceof TypeError)
        return undefined
      throw err
    }

    if (LINK_PROTOCOLS.has(url.protocol))
      return url.toString()
    return '#'
  }
}

function removeUnicodeEmoji(node: Node) {
  if (node.type !== TEXT_NODE)
    return node

  let start = 0

  const matches = [] as (string | Node)[]
  findAndReplaceEmojisInText(emojiRegEx, node.value, (match, result) => {
    matches.push(result.slice(start).trimEnd())
    start = result.length + match.match.length
    return undefined
  })
  if (matches.length === 0)
    return node

  matches.push(node.value.slice(start))
  return matches.filter(Boolean)
}

function transformUnicodeEmoji(node: Node) {
  if (node.type !== TEXT_NODE)
    return node

  let start = 0

  const matches = [] as (string | Node)[]
  findAndReplaceEmojisInText(emojiRegEx, node.value, (match, result) => {
    const attrs = getEmojiAttributes(match)
    matches.push(result.slice(start))
    matches.push(h('img', { src: attrs.src, alt: attrs.alt, class: attrs.class }))
    start = result.length + match.match.length
    return undefined
  })
  if (matches.length === 0)
    return node

  matches.push(node.value.slice(start))
  return matches.filter(Boolean)
}

function removeCustomEmoji(customEmojis: Record<string, mastodon.v1.CustomEmoji>): Transform {
  return (node) => {
    if (node.type !== TEXT_NODE)
      return node

    const split = node.value.split(/\s?:([\w-]+):/g)
    if (split.length === 1)
      return node

    return split.map((name, i) => {
      if (i % 2 === 0)
        return name

      const emoji = customEmojis[name] as mastodon.v1.CustomEmoji
      if (!emoji)
        return `:${name}:`

      return ''
    }).filter(Boolean)
  }
}

function replaceCustomEmoji(customEmojis: Record<string, mastodon.v1.CustomEmoji>): Transform {
  return (node) => {
    if (node.type !== TEXT_NODE)
      return node

    const split = node.value.split(/:([\w-]+):/g)
    if (split.length === 1)
      return node

    return split.map((name, i) => {
      if (i % 2 === 0)
        return name

      const emoji = customEmojis[name] as mastodon.v1.CustomEmoji
      if (!emoji)
        return `:${name}:`

      return h(
        'picture',
        {
          'alt': `:${name}:`,
          'class': 'custom-emoji',
          'data-emoji-id': name,
        },
        [
          h(
            'source',
            {
              srcset: emoji.staticUrl,
              media: '(prefers-reduced-motion: reduce)',
            },
          ),
          h(
            'img',
            {
              src: emoji.url,
              alt: `:${name}:`,
            },
          ),
        ],
      )
    }).filter(Boolean)
  }
}

const _markdownReplacements: [RegExp, (c: (string | Node)[]) => Node][] = [
  [/\*\*\*(.*?)\*\*\*/g, ([c]) => h('b', null, [h('em', null, c)])],
  [/\*\*(.*?)\*\*/g, c => h('b', null, c)],
  [/\*(.*?)\*/g, c => h('em', null, c)],
  [/~~(.*?)~~/g, c => h('del', null, c)],
  [/`([^`]+)`/g, c => h('code', null, c)],
  // transform @username@twitter.com as links
  [/\B@(\w+)@twitter\.com\b/gi, c => h('a', { href: `https://twitter.com/${c}`, target: '_blank', rel: 'nofollow noopener noreferrer', class: 'mention external' }, `@${c}@twitter.com`)],
]

function _markdownProcess(value: string) {
  const results = [] as (string | Node)[]

  let start = 0
  while (true) {
    let found: {
      match: RegExpMatchArray
      replacer: (c: (string | Node)[]) => Node
    } | undefined

    for (const [re, replacer] of _markdownReplacements) {
      re.lastIndex = start

      const match = re.exec(value)
      if (match) {
        if (!found || match.index < found.match.index!)
          found = { match, replacer }
      }
    }

    if (!found)
      break

    results.push(value.slice(start, found.match.index))
    results.push(found.replacer(_markdownProcess(found.match[1])))
    start = found.match.index! + found.match[0].length
  }

  results.push(value.slice(start))
  return results.filter(Boolean)
}

function transformMarkdown(node: Node) {
  if (node.type !== TEXT_NODE)
    return node
  return _markdownProcess(node.value)
}

function addBdiParagraphs(node: Node) {
  if (node.name === 'p' && !('dir' in node.attributes) && node.children?.length && node.children.length > 1)
    node.attributes.dir = 'auto'

  return node
}

function transformParagraphs(node: Node): Node | Node[] {
  // Add bdi to paragraphs
  addBdiParagraphs(node)

  // For top level paragraphs, inject an empty <p> to preserve status paragraphs in our editor (except for the last one)
  if (node.parent?.type === DOCUMENT_NODE && node.name === 'p' && node.parent.children.at(-1) !== node)
    return [node, h('p')]

  return node
}

function isMention(node: Node) {
  const child = node.children?.length === 1 ? node.children[0] : null
  return Boolean(child?.name === 'a' && child.attributes.class?.includes('mention'))
}

function isSpacing(node: Node) {
  return node.type === TEXT_NODE && !node.value.trim()
}

// Extract the username from a known mention node
function getMentionHandle(node: Node): string | undefined {
  return hrefToHandle(node.children?.[0].attributes.href) ?? node.children?.[0]?.children?.[0]?.attributes?.['data-id']
}

function transformCollapseMentions(status?: mastodon.v1.Status, inReplyToStatus?: mastodon.v1.Status): Transform {
  let processed = false

  return (node: Node, root: Node): Node | Node[] => {
    if (processed || node.parent !== root || !node.children)
      return node
    const mentions: (Node | undefined)[] = []
    const children = node.children as Node[]
    let trimContentStart: (() => void) | undefined
    for (const child of children) {
      // mention
      if (isMention(child)) {
        mentions.push(child)
      }
      // spaces in between
      else if (isSpacing(child)) {
        mentions.push(child)
      }
      // other content, stop collapsing
      else {
        if (child.type === TEXT_NODE) {
          trimContentStart = () => {
            child.value = child.value.trimStart()
          }
        }
        // remove <br> after mention
        if (child.name === 'br')
          mentions.push(undefined)
        break
      }
    }
    processed = true
    if (mentions.length === 0)
      return node

    let mentionsCount = 0
    let contextualMentionsCount = 0
    let removeNextSpacing = false

    const contextualMentions = mentions.filter((mention) => {
      if (!mention)
        return false

      if (removeNextSpacing && isSpacing(mention)) {
        removeNextSpacing = false
        return false
      }

      if (isMention(mention)) {
        mentionsCount++
        if (inReplyToStatus) {
          const mentionHandle = getMentionHandle(mention)
          if (inReplyToStatus.account.acct === mentionHandle || inReplyToStatus.mentions.some(m => m.acct === mentionHandle)) {
            removeNextSpacing = true
            return false
          }
        }
        contextualMentionsCount++
      }
      return true
    }) as Node[]

    // We have a special case for single mentions that are part of a reply.
    // We already have the replying to badge in this case or the status is connected to the previous one.
    // This is needed because the status doesn't include the in Reply to handle, only the account id.
    // But this covers the majority of cases.
    const showMentions = !(contextualMentionsCount === 0 || (mentionsCount === 1 && status?.inReplyToAccountId))
    const grouped = contextualMentionsCount > 2
    if (!showMentions || grouped)
      trimContentStart?.()

    const contextualChildren = children.slice(mentions.length)
    const mentionNodes = showMentions ? (grouped ? [h('mention-group', null, ...contextualMentions)] : contextualMentions) : []
    return {
      ...node,
      children: [...mentionNodes, ...contextualChildren],
    }
  }
}

function hrefToHandle(href: string): string | undefined {
  const matchUser = href.match(UserLinkRE)
  if (matchUser) {
    const [, server, username] = matchUser
    return `${username}@${server.replace(/(.+\.)(.+\..+)/, '$2')}`
  }
}

function transformMentionLink(node: Node): string | Node | (string | Node)[] | null {
  if (node.name === 'a' && node.attributes.class?.includes('mention')) {
    const href = node.attributes.href
    if (href) {
      const handle = hrefToHandle(href)
      if (handle) {
        // convert to Tiptap mention node
        return h('span', { 'data-type': 'mention', 'data-id': handle }, handle)
      }
    }
  }
  return node
}

function createTransformNamedMentions(mentions: mastodon.v1.StatusMention[]) {
  return (node: Node): string | Node | (string | Node)[] | null => {
    if (node.name === 'a' && node.attributes.class?.includes('mention')) {
      const href = node.attributes.href
      const mention = href && mentions.find(m => m.url === href)
      if (mention) {
        node.attributes.href = `/${currentServer.value}/@${mention.acct}`
        node.children = [h('span', { 'data-type': 'mention', 'data-id': mention.acct }, `@${mention.username}`)]
        return node
      }
    }
    return node
  }
}
