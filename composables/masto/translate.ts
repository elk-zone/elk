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
  const status = $ref({
    success: false,
    error: '',
    text: '',
  })
  try {
    const response = await $fetch<TranslationResponse>(config.public.translateApi, {
      method: 'POST',
      body: {
        q: text,
        source: from ?? 'auto',
        target: to ?? languageCode,
        format: 'html',
        api_key: '',
      },
    })
    status.success = true
    status.text = response.translatedText
  }
  catch (err) {
    // TODO: improve type
    status.error = (err as { data: { error: string } }).data.error
  }
  return status
}

const translations = new WeakMap<mastodon.v1.Status | mastodon.v1.StatusEdit, { visible: boolean; text: string; success: boolean; error: string }>()

export function useTranslation(status: mastodon.v1.Status | mastodon.v1.StatusEdit) {
  if (!translations.has(status))
    translations.set(status, reactive({ visible: false, text: '', success: false, error: '' }))

  const translation = translations.get(status)!

  async function toggle() {
    if (!('language' in status))
      return

    if (!translation.text) {
      const { success, text, error } = await translateText(status.content, status.language)
      translation.error = error
      translation.text = text
      translation.success = success
    }

    translation.visible = !translation.visible
  }

  return {
    enabled: !!useRuntimeConfig().public.translateApi,
    toggle,
    translation,
  }
}
