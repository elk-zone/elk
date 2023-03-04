import type { Highlighter, Lang } from 'shiki-es'

const shiki = ref<Highlighter>()

const registeredLang = ref(new Map<string, boolean>())
let shikiImport: Promise<void> | undefined

export function useHighlighter(lang: Lang) {
  if (!shikiImport) {
    shikiImport = import('shiki-es')
      .then(async (r) => {
        r.setCDN('/shiki/')
        shiki.value = await r.getHighlighter({
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
  }

  if (!shiki.value)
    return undefined

  if (!registeredLang.value.get(lang)) {
    shiki.value.loadLanguage(lang)
      .then(() => {
        registeredLang.value.set(lang, true)
      })
      .catch(() => {
        const fallbackLang = 'md'
        shiki.value?.loadLanguage(fallbackLang).then(() => {
          registeredLang.value.set(fallbackLang, true)
        })
      })
    return undefined
  }

  return shiki.value
}

export function useShikiTheme() {
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
  const shiki = useHighlighter(lang)
  if (!shiki)
    return escapeHtml(code)

  return shiki.codeToHtml(code, {
    lang,
    theme: useShikiTheme(),
  })
}

export function useShiki() {
  return shiki
}
