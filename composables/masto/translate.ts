import type { mastodon } from 'masto'

export interface TranslationResponse {
  translatedText: string
  detectedLanguage: {
    confidence: number
    language: string
  }
}

// @see https://github.com/LibreTranslate/LibreTranslate/tree/main/libretranslate/locales
export const supportedTranslationCodes = [
  'ar',
  'az',
  'cs',
  'da',
  'de',
  'el',
  'en',
  'eo',
  'es',
  'fa',
  'fi',
  'fr',
  'ga',
  'he',
  'hi',
  'hu',
  'id',
  'it',
  'ja',
  'ko',
  'nl',
  'pl',
  'pt',
  'ru',
  'sk',
  'sv',
  'tr',
  'uk',
  'vi',
  'zh',
] as const

export function getLanguageCode() {
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

export async function translateText(input: mastodon.v1.Status, from: string | null | undefined, to: string) {
  const config = useRuntimeConfig()
  const status = $ref({
    success: false,
    error: '',
    text: '',
  })
  if (currentInstance.value.configuration?.translationEnabled) {
    try {
      const { client } = $(useMasto())
      const response = await client.v1.statuses.translate(input.id)
      status.success = true
      status.text = response.content
    }
    catch (err) {
      status.error = response.error
    }
  } else {
    try {
      const response = await ($fetch as any)(config.public.translateApi, {
        method: 'POST',
        body: {
          q: input.content,
          source: from ?? 'auto',
          target: to,
          format: 'html',
          api_key: '',
        },
      }) as TranslationResponse
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
  }
  
  return status
}

const translations = new WeakMap<mastodon.v1.Status | mastodon.v1.StatusEdit, { visible: boolean; text: string; success: boolean; error: string }>()

export function useTranslation(status: mastodon.v1.Status | mastodon.v1.StatusEdit, to: string) {
  if (!translations.has(status))
    translations.set(status, reactive({ visible: false, text: '', success: false, error: '' }))

  const translation = translations.get(status)!
  const userSettings = useUserSettings()

  const shouldTranslate = 'language' in status && status.language && status.language !== to
    && supportedTranslationCodes.includes(to as any)
    && supportedTranslationCodes.includes(status.language as any)
    && !userSettings.value.disabledTranslationLanguages.includes(status.language)
  const enabled = /*! !useRuntimeConfig().public.translateApi && */ shouldTranslate

  async function toggle() {
    if (!shouldTranslate)
      return

    if (!translation.text) {
      const { success, text, error } = await translateText(status, status.language, to)
      translation.error = error
      translation.text = text
      translation.success = success
    }

    translation.visible = !translation.visible
  }

  return {
    enabled,
    toggle,
    translation,
  }
}
