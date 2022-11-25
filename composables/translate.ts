import type { Status } from 'masto'

export interface TranslationResponse {
  translatedText: string
  detectedLanguage: {
    confidence: number
    language: string
  }
}

const config = useRuntimeConfig()

export async function translateText(text: string) {
  const { translatedText } = await $fetch<TranslationResponse>(config.public.translateApi, {
    method: 'POST',
    body: {
      q: text,
      source: 'auto',
      target: navigator.language.replace(/-.*$/, ''),
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
      translation.text = await translateText(status.content)

    translation.visible = !translation.visible
  }

  return {
    enabled: !!config.public.translateApi,
    toggle,
    translation,
  }
}
