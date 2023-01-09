import type { SFCManifest } from '..'
import { setHookContext } from './hook'
import type { NuxtApp } from '#app'

export default defineNuxtPlugin(async (nuxt) => {
  let getManifest: (id: string) => SFCManifest | undefined
  if (import.meta.env.DEV) {
    const { getManifest: _getManifest } = await import('./devManifest')
    getManifest = _getManifest
  }
  else {
    return
  }

  setHookContext({
    nuxt: nuxt as NuxtApp,
    getManifest,
  })
})
