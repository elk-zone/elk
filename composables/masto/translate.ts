import type { mastodon } from 'masto'

export interface TranslationResponse {
  translatedText: string
  detectedLanguage: {
    confidence: number
    language: string
  }
}

export const getLanguageCode = () => {
  let code = 'en'
  const getCode = (code: string) => code.replace(/-.*$/, '')
  if (!process.server) {
    const { locale } = useI18n()
    code = getCode(locale.value ? locale.value : navigator.language)
  }
  return code
}

interface TranslationErr {
  data?: {
    error?: string
  }
}

export async function translateText(text: string, from: string | null | undefined, to: string) {
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
        target: to,
        format: 'html',
        api_key: '',
      },
    })
    status.success = true
    status.text = response.translatedText
  }
  catch (err) {
    // TODO: improve type
    if ((err as TranslationErr).data?.error)
      status.error = (err as TranslationErr).data!.error!
    else
      status.error = 'Unknown Error, Please check your console in browser devtool.'
    console.error('Translate Post Error: ', err)
  }
  return status
}

const translations = new WeakMap<mastodon.v1.Status | mastodon.v1.StatusEdit, { visible: boolean; text: string; success: boolean; error: string }>()

export function useTranslation(status: mastodon.v1.Status | mastodon.v1.StatusEdit, to: string) {
  if (!translations.has(status))
    translations.set(status, reactive({ visible: false, text: '', success: false, error: '' }))

  const translation = translations.get(status)!

  async function toggle() {
    if (!('language' in status))
      return

    if (!translation.text) {
      const { success, text, error } = await translateText(status.content, status.language, to)
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
