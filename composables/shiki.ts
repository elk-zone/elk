import type { Highlighter, BuiltinLanguage as Lang } from 'shiki'

const highlighter = ref<Highlighter>()

const registeredLang = ref(new Map<string, boolean>())
let shikiImport: Promise<void> | undefined

export function useHighlighter(lang: Lang): {
  promise?: Promise<void>
  highlighter?: Highlighter
} {
  if (!shikiImport) {
    shikiImport = import('shiki')
      .then(async ({ getHighlighter }) => {
        highlighter.value = await getHighlighter({
          themes: [
            'vitesse-dark',
            'vitesse-light',
          ],
          langs: [
            'js',
            'css',
            'html',
          ],
        })
      })

    return { promise: shikiImport }
  }

  if (!highlighter.value)
    return { promise: shikiImport }

  if (!registeredLang.value.get(lang)) {
    const promise = highlighter.value.loadLanguage(lang)
      .then(() => {
        registeredLang.value.set(lang, true)
      })
      .catch(() => {
        const fallbackLang = 'md'
        highlighter.value?.loadLanguage(fallbackLang).then(() => {
          registeredLang.value.set(fallbackLang, true)
        })
      })
    return { promise }
  }

  return { highlighter: highlighter.value }
}

function useShikiTheme() {
  return useColorMode().value === 'dark' ? 'vitesse-dark' : 'vitesse-light'
}

const HTML_ENTITIES = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '\'': '&apos;',
  '"': '&quot;',
} as Record<string, string>

function escapeHtml(text: string) {
  return text.replace(/[<>&'"]/g, ch => HTML_ENTITIES[ch])
}

export function highlightCode(code: string, lang: Lang) {
  const { highlighter } = useHighlighter(lang)
  if (!highlighter)
    return escapeHtml(code)

  return highlighter.codeToHtml(code, {
    lang,
    theme: useShikiTheme(),
  })
}
