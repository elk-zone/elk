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

const translationAPISupported = 'Translator' in globalThis && 'LanguageDetector' in globalThis

const anchorMarkupRegEx = /<a[^>]*>.*?<\/a>/g

export function getLanguageCode() {
  let code = 'en'
  const getCode = (code: string) => code.replace(/-.*$/, '')
  if (import.meta.client) {
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

function replaceTranslatedLinksWithOriginal(text: string) {
  return text.replace(anchorMarkupRegEx, (match) => {
    const tagLink = anchorMarkupRegEx.exec(text)
    return tagLink ? tagLink[0] : match
  })
}

export async function translateText(text: string, from: string | null | undefined, to: string) {
  const config = useRuntimeConfig()
  const status = ref({
    success: false,
    error: '',
    text: '',
  })
  try {
    const response = await ($fetch as any)(config.public.translateApi, {
      method: 'POST',
      body: {
        q: text,
        source: from ?? 'auto',
        target: to,
        format: 'html',
        api_key: '',
      },
    }) as TranslationResponse
    status.value.success = true
    status.value.text = replaceTranslatedLinksWithOriginal(response.translatedText)
  }
  catch (err) {
    // TODO: improve type
    if ((err as TranslationErr).data?.error)
      status.value.error = (err as TranslationErr).data!.error!
    else
      status.value.error = 'Unknown Error, Please check your console in browser devtool.'
    console.error('Translate Post Error: ', err)
  }
  return status
}

const translations = new WeakMap<mastodon.v1.Status | mastodon.v1.StatusEdit, {
  visible: boolean
  text: string
  success: boolean
  error: string
}>()

export async function useTranslation(status: mastodon.v1.Status | mastodon.v1.StatusEdit, to: string) {
  if (!translations.has(status))
    translations.set(status, reactive({ visible: false, text: '', success: false, error: '' }))

  const translation = translations.get(status)!
  const userSettings = useUserSettings()

  let shouldTranslate = false
  if ('language' in status) {
    shouldTranslate = typeof status.language === 'string' && status.language !== to && !userSettings.value.disabledTranslationLanguages.includes(status.language)
    if (!translationAPISupported) {
      shouldTranslate = shouldTranslate && supportedTranslationCodes.includes(to as any)
        && supportedTranslationCodes.includes(status.language as any)
    }
    else {
      shouldTranslate = shouldTranslate && (await (globalThis as any).Translator.availability({
        sourceLanguage: status.language,
        targetLanguage: to,
      })) !== 'unavailable'
    }
  }
  const enabled = /*! !useRuntimeConfig().public.translateApi && */ shouldTranslate

  async function toggle() {
    if (!shouldTranslate)
      return

    if (!translation.text) {
      let translated = {
        value: {
          error: '',
          text: '',
          success: false,
        },
      }
      if (translationAPISupported && 'language' in status) {
        let sourceLanguage = status.language
        if (!sourceLanguage) {
          const languageDetector = await (globalThis as any).LanguageDetector.create()
          // Make sure HTML markup doesn't derail language detection.
          const div = document.createElement('div')
          div.innerHTML = status.content
          // eslint-disable-next-line unicorn/prefer-dom-node-text-content
          const detectedLanguages = await languageDetector.detect(div.innerText)
          sourceLanguage = detectedLanguages[0].detectedLanguage
          if (sourceLanguage === 'und') {
            throw new Error('Could not detect source language.')
          }
        }
        const translator = await (globalThis as any).Translator.create({
          sourceLanguage,
          targetLanguage: to,
        })
        try {
          let text = await translator.translate(status.content)
          text = replaceTranslatedLinksWithOriginal(text)
          translated.value = {
            error: '',
            text,
            success: true,
          }
        }
        catch (error) {
          translated.value = {
            error: (error as Error).message,
            text: '',
            success: false,
          }
        }
      }
      else {
        if ('language' in status) {
          translated = await translateText(status.content, status.language, to)
        }
      }
      translation.error = translated.value.error
      translation.text = translated.value.text
      translation.success = translated.value.success
    }
    translation.visible = !translation.visible
  }

  return {
    enabled,
    toggle,
    translation,
  }
}
