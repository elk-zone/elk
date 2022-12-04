import type { Highlighter, Lang } from 'shiki-es'

export const shiki = ref<Highlighter>()

const registeredLang = ref(new Map<string, boolean>())
let shikiImport: Promise<void> | undefined

export function highlightCode(code: string, lang: Lang) {
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
    return code

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
    return code
  }

  return shiki.value.codeToHtml(code, {
    lang,
    theme: isDark.value ? 'vitesse-dark' : 'vitesse-light',
  })
}
