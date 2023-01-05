import type { SetupContext } from 'vue'
import type { SFCManifest } from '..'

type AutoImportables = typeof import('#imports')
type SetupArgs = [Readonly<any>, SetupContext]
type SetupRefs = Partial<AutoImportables> & Record<string, any>
type RenderRefs = Partial<AutoImportables> & Record<string, any>

export default defineNuxtPlugin(async (nuxt) => {
  let getManifest: (id: string) => SFCManifest | undefined
  if (import.meta.env.DEV) {
    const { getManifest: _getManifest } = await import('./devManifest')
    getManifest = _getManifest
  }
  else {
    return
  }

  const hooks = {
    setupRef: (id: string, args: SetupArgs, refs: any[]) => {
      const manifest = getManifest(id)
      if (manifest) {
        // decode refs
        const decodedRefs = Object.fromEntries(
          refs.map((ref, i) => [manifest.setupRefs[i], ref]),
        ) as SetupRefs
      }

      return refs
    },
    setupDecl: (id: string, decls: any[]) => {
      const manifest = getManifest(id)
      if (manifest) {
        // decode decls
        const decodedDecls = Object.fromEntries(
          decls.map((decl, i) => [manifest.setupDecls[i], decl]),
        ) as Record<string, any>
      }

      return decls
    },
    renderRef: (id: string, args: unknown, refs: any[]) => {
      const manifest = getManifest(id)
      if (manifest) {
        // decode refs
        const decodedRefs = Object.fromEntries(
          refs.map((ref, i) => [manifest.renderRefs[i], ref]),
        ) as RenderRefs
      }

      return refs
    },
  }

  nuxt.vueApp.mixin({
    $elkPlugin: hooks,
  })
  nuxt.vueApp.provide('$elkPlugin', hooks)
})
