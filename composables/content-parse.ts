import type { Emoji } from 'masto'
import type { Node } from 'ultrahtml'
import { TEXT_NODE, parse, render, walkSync } from 'ultrahtml'

const EMOJI_REGEX = /(\p{Emoji_Presentation})/ug

const decoder = process.client ? document.createElement('textarea') : null as any as HTMLTextAreaElement
export function decodeHtml(text: string) {
  decoder.innerHTML = text
  return decoder.value
}

/**
 * Parse raw HTML form Mastodon server to AST,
 * with interop of custom emojis and inline Markdown syntax
 */
export function parseMastodonHTML(html: string, customEmojis: Record<string, Emoji> = {}, markdown = true) {
  let processed = html
    // custom emojis
    .replace(/:([\w-]+?):/g, (_, name) => {
      const emoji = customEmojis[name]

      return emoji
        ? `<img src="${emoji.url}" alt=":${name}:" class="custom-emoji" data-emoji-id="${name}" />`
        : `:${name}:`
    })
    .replace(EMOJI_REGEX, '<em-emoji native="$1" />')

  if (markdown) {
    // handle code blocks
    processed = processed
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
  }

  return parse(processed)
}

export function convertMastodonHTML(html: string, customEmojis: Record<string, Emoji> = {}) {
  const tree = parseMastodonHTML(html, customEmojis)
  return render(tree)
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
    return decodeHtml(input.value)

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

  // add spaces around emoji to prevent parsing errors: 2 or more consecutive emojis will not be parsed
  if (input.name === 'img' && input.attributes.class?.includes('custom-emoji'))
    return ` :${input.attributes['data-emoji-id']}: `

  return pre + body + post
}
