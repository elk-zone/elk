import type { ActiveHeadEntry, HeadEntryOptions, UseHeadInput } from '@vueuse/head'
import type { HeadAugmentations } from '@nuxt/schema'
import { useHead as _useHead } from '#head'

export function useHead<T extends HeadAugmentations>(input: UseHeadInput<T>, options?: HeadEntryOptions): ActiveHeadEntry<UseHeadInput<T>> | void {
  const deactivated = useDeactivated()
  return _useHead(() => {
    if (deactivated.value)
      return {}
    return resolveUnref(input)
  }, options)
}
