import type { mastodon } from 'masto'

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

const translations = new WeakMap<mastodon.v1.Status | mastodon.v1.StatusEdit, { visible: boolean; text: string }>()

export function useTranslation(status: mastodon.v1.Status | mastodon.v1.StatusEdit) {
  if (!translations.has(status))
    translations.set(status, reactive({ visible: false, text: '' }))

  const translation = translations.get(status)!

  async function toggle() {
    if (!('language' in status))
      return

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
