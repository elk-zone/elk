import { defineNuxtPlugin } from '#app'
import type { Composer } from '#i18n'

let global: Composer<{}, {}, {}, string, string, string>

export default defineNuxtPlugin((nuxtApp) => {
  global = nuxtApp.$i18n
})

/** Get the global instance of i18n to use it outside of `vue setup` */
export function i18nGlobal() {
  return global
}
