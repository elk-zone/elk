import type { mastodon } from 'masto'

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
 
export async function translateText(id: string, from: string | null | undefined, to: string) {
  const config = useRuntimeConfig()
  const status = $ref({
    success: false,
    error: '',
    text: '',
  })
  try {
    const { client } = $(useMasto())
    const response = await client.v1.statuses.translate(id)
    status.success = true
    status.text = response.content
  }
  catch (err) {
    status.error = response.error
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
      const { success, text, error } = await translateText(status.id, status.language, to)
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
