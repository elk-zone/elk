import { type Parser, createParser } from 'prosemirror-highlight/shikiji'
import type { BuiltinLanguage } from 'shikiji/langs'

let parser: Parser | undefined

export const shikijiParser: Parser = (options) => {
  const lang = options.language ?? 'text'

  // Register the language if it's not yet registered
  const highlighter = useHighlighter(lang as BuiltinLanguage)

  // If the language is not loaded, we return an empty set of decorations
  if (!highlighter)
    return []

  if (!parser)
    parser = createParser(highlighter)

  return parser(options)
}
