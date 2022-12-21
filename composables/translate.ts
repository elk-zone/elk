import type { Status } from 'masto'

export interface TranslationResponse {
  translatedText: string
  detectedLanguage: {
    confidence: number
    language: string
  }
}

export const languageCode = process.server ? 'en' : navigator.language.replace(/-.*$/, '')
export async function translateText(text: string, from?: string | null, to?: string) {
  const config = useRuntimeConfig()
  const { translatedText } = await $fetch<TranslationResponse>(config.public.translateApi, {
    method: 'POST',
    body: {
      q: text,
      source: from ?? 'auto',
      target: to ?? languageCode,
      format: 'html',
      api_key: '',
    },
  })
  return translatedText
}

const translations = new WeakMap<Status, { visible: boolean; text: string }>()

export function useTranslation(status: Status) {
  if (!translations.has(status))
    translations.set(status, reactive({ visible: false, text: '' }))

  const translation = translations.get(status)!

  async function toggle() {
    if (!translation.text)
      translation.text = await translateText(status.content, status.language)

    translation.visible = !translation.visible
  }

  return {
    enabled: !!useRuntimeConfig().public.translateApi,
    toggle,
    translation,
  }
}
