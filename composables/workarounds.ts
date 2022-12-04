import type { ActiveHeadEntry, HeadEntryOptions, UseHeadInput } from '@vueuse/head'
import type { HeadAugmentations } from '@nuxt/schema'
import { useHead } from '#head'

// TODO: Workaround for Nuxt bug: https://github.com/elk-zone/elk/pull/199#issuecomment-1329771961
export function useHeadFixed<T extends HeadAugmentations>(input: UseHeadInput<T>, options?: HeadEntryOptions): ActiveHeadEntry<UseHeadInput<T>> | void {
  const deactivated = useDeactivated()
  return useHead(() => {
    if (deactivated.value)
      return {}
    return resolveUnref(input)
  }, options)
}
