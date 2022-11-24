import type { Highlighter, Lang } from 'shiki'

export const shiki = ref<Highlighter>()

const registeredLang = ref(new Map<string, boolean>())
let shikiImport: Promise<void> | undefined

export function highlightCode(code: string, lang: Lang) {
  if (!shikiImport) {
    shikiImport = import('shiki')
      .then(async (r) => {
        r.setCDN('/shiki/')
        shiki.value = await r.getHighlighter({
          themes: [
            'vitesse-dark',
            'vitesse-light',
          ],
          langs: [
            lang,
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
    return code
  }

  return shiki.value.codeToHtml(code, {
    lang,
    theme: isDark.value ? 'vitesse-dark' : 'vitesse-light',
  })
}
