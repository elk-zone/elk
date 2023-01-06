import type { ComponentInternalInstance } from 'vue'
import { onActivated, onDeactivated, ref } from 'vue'
import type { ActiveHeadEntry, HeadEntryOptions, UseHeadInput } from '@vueuse/head'
import type { HeadAugmentations } from '@nuxt/schema'
import { useHead } from '#head'

export const isHydrated = ref(false)

/**
 * ### Whether the current component is running in the background
 *
 * for handling problems caused by the keepalive function
 */
export function useDeactivated() {
  const deactivated = ref(false)
  onActivated(() => deactivated.value = false)
  onDeactivated(() => deactivated.value = true)

  return deactivated
}

/**
 * ### When the component is restored from the background
 *
 * for handling problems caused by the keepalive function
 */
export function onReactivated(hook: Function, target?: ComponentInternalInstance | null): void {
  const initial = ref(true)
  onActivated(() => {
    if (initial.value)
      return
    hook()
  }, target)
  onDeactivated(() => initial.value = false)
}

// TODO: Workaround for Nuxt bug: https://github.com/elk-zone/elk/pull/199#issuecomment-1329771961
export function useHeadFixed<T extends HeadAugmentations>(input: UseHeadInput<T>, options?: HeadEntryOptions): ActiveHeadEntry<UseHeadInput<T>> | void {
  const deactivated = useDeactivated()
  return useHead(() => {
    if (deactivated.value)
      return {}
    return resolveUnref(input)
  }, options)
}
