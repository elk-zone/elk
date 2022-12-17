import type { Highlighter, Lang } from 'shiki-es'

const shiki = ref<Highlighter>()

const registeredLang = ref(new Map<string, boolean>())
let shikiImport: Promise<void> | undefined

export function useHightlighter(lang: Lang) {
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
      .catch((e) => {
        console.error(`[shiki] Failed to load language ${lang}`)
        console.error(e)
        registeredLang.value.set(lang, false)
      })
    return undefined
  }

  return shiki.value
}

export function useShikiTheme() {
  return isDark.value ? 'vitesse-dark' : 'vitesse-light'
}

export function highlightCode(code: string, lang: Lang) {
  const shiki = useHightlighter(lang)
  if (!shiki)
    return code

  return shiki.codeToHtml(code, {
    lang,
    theme: useShikiTheme(),
  })
}

export function useShiki() {
  return shiki
}
