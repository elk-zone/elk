import type { SetupContext } from 'vue'

type AutoImportables = typeof import('#imports')
type SetupArgs = [Readonly<any>, SetupContext]
type SetupRefs = Partial<AutoImportables> & Record<string, any>

export default defineNuxtPlugin(async (nuxt) => {
  const hooks = {
    setupRef: (id: string, args: SetupArgs, refs: SetupRefs) => {
      console.log('setupRef', id, args, refs)

      // replace imported useFeatureFlags
      if (refs.useFeatureFlags) {
        const useFeatureFlags = refs.useFeatureFlags
        refs.useFeatureFlags = () => {
          return {
            ...useFeatureFlags(),
            injectedFlag: true,
          }
        }
      }

      return refs
    },
    setupDecl: (id: string, decls: Record<string, any>) => {
      console.log('setupDecl', id, decls)

      return decls
    },
    renderRef: (id: string, args: unknown, refs: Record<string, any>) => {
      console.log('renderRef', id, args, refs)

      return refs
    },
  }
  nuxt.vueApp.mixin({
    $elkPlugin: hooks,
  })
  nuxt.vueApp.provide('$elkPlugin', hooks)
})
