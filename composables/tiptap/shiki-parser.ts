import type { BuiltinLanguage } from 'shiki'
import { createParser, type Parser } from 'prosemirror-highlight/shiki'

let parser: Parser | undefined

export const shikiParser: Parser = (options) => {
  const lang = options.language ?? 'text'

  // Register the language if it's not yet registered
  const { highlighter, promise } = useHighlighter(lang as BuiltinLanguage)

  // If the highlighter or the language is not available, return a promise that
  // will resolve when it's ready. When the promise resolves, the editor will
  // re-parse the code block.
  if (!highlighter)
    return promise ?? []

  if (!parser)
    parser = createParser(highlighter)

  return parser(options)
}
