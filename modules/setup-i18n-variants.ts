import { defineNuxtModule } from '@nuxt/kit'

import { readFile } from 'fs-extra'
import { resolve } from 'pathe'
import type { DefineLocaleMessage, LocaleMessages } from 'vue-i18n'
import { countryLocaleVariants } from '../config/i18n'
import type { LocaleObject } from '#i18n'

export default defineNuxtModule({
  meta: {
    name: 'elk-i18n-country-variants',
  },
  async setup(_, nuxt) {
    nuxt.hook('i18n:extend-messages', async (additionalMessages) => {
      const filteredLocales = await Promise.all(Object.entries(countryLocaleVariants).map(async ([code, variants]) => {
        return await buildLocaleCountryVariants(code, variants)
      }))
      additionalMessages.push(...filteredLocales)
    })
  },
})

async function buildLocaleCountryVariants(code: string, variants: (LocaleObject & { overrideFile?: boolean })[]) {
  const name = `${code}.json`
  const defaultEntries = await readI18nFile(name)
  const fullVariants: LocaleMessages<DefineLocaleMessage> = {}
  await Promise.all(variants.map(async ({ code, overrideFile }) => {
    if (overrideFile)
      fullVariants[code] = { ...defaultEntries, ...(await readI18nFile(`${code}.json`)) }
    else
      fullVariants[code] = { ...defaultEntries }
  }))

  return fullVariants
}

async function readI18nFile(file: string) {
  return JSON.parse(Buffer.from(
    await readFile(resolve(`./locales/${file}`), 'utf-8'),
  ).toString())
}
