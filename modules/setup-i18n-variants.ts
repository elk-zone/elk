import { defineNuxtModule } from '@nuxt/kit'

import { readFile } from 'fs-extra'
import { resolve } from 'pathe'
import type { DefineLocaleMessage, LocaleMessages } from 'vue-i18n'
import { isObject } from '@intlify/shared'
import { countryLocaleVariants } from '../config/i18n'
import type { LocaleObject } from '#i18n'

export default defineNuxtModule({
  meta: {
    name: 'elk-i18n-country-variants',
  },
  async setup(_, nuxt) {
    nuxt.hook('i18n:extend-messages', async (additionalMessages) => {
      const messages: LocaleMessages<DefineLocaleMessage> = {}
      const defaultLocaleEntries: Record<string, unknown> = await readI18nFile('en-US.json')
      await Promise.all(Object.entries(countryLocaleVariants).map(async ([code, variants]) => {
        await buildLocaleCountryVariants(messages, defaultLocaleEntries, code, variants)
      }))
      additionalMessages.push(messages)
    })
  },
})

async function readI18nFile(file: string) {
  return JSON.parse(Buffer.from(
    await readFile(resolve(`./locales/${file}`), 'utf-8'),
  ).toString())
}
function deepCopy(src: Record<string, any>, des: Record<string, any>) {
  for (const key in src) {
    if (isObject(src[key])) {
      if (!isObject(des[key]))
        des[key] = {}

      deepCopy(src[key], des[key])
    }
    else {
      des[key] = src[key]
    }
  }
}

async function buildLocaleCountryVariants(
  messages: LocaleMessages<DefineLocaleMessage>,
  defaultLocaleEntries: Record<string, unknown>,
  currentCode: string,
  variants: (LocaleObject & { overrideFile?: boolean })[],
) {
  const defaultVariantEntries = await readI18nFile(`${currentCode}.json`)
  await Promise.all(variants.map(async ({ code, overrideFile }) => {
    const entry: Record<string, any> = {}
    deepCopy(defaultLocaleEntries, entry)
    deepCopy(defaultVariantEntries, entry)
    if (overrideFile)
      deepCopy(await readI18nFile(`${code}.json`), entry)

    messages[code] = entry
  }))
}
