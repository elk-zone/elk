import type { ComponentInternalInstance } from 'vue'
import { onActivated, onDeactivated, ref } from 'vue'
import type { ActiveHeadEntry, HeadEntryOptions, UseHeadInput } from '@unhead/vue'
import type { SchemaAugmentations } from '@unhead/schema'

export const isHydrated = ref(false)

export function onHydrated(cb: () => unknown) {
  watchOnce(isHydrated, () => cb(), { immediate: isHydrated.value })
}

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
export function onReactivated(hook: () => void, target?: ComponentInternalInstance | null): void {
  const initial = ref(true)
  onActivated(() => {
    if (initial.value)
      return
    hook()
  }, target)
  onDeactivated(() => initial.value = false)
}

export function useHydratedHead<T extends SchemaAugmentations>(input: UseHeadInput<T>, options?: HeadEntryOptions): ActiveHeadEntry<UseHeadInput<T>> | void {
  if (input && typeof input === 'object' && !('value' in input)) {
    const title = 'title' in input ? input.title : undefined
    if (process.server && title) {
      input.meta = input.meta || []
      if (Array.isArray(input.meta)) {
        input.meta.push(
          { property: 'og:title', content: (typeof input.title === 'function' ? input.title() : input.title) as string },
        )
      }
    }
    else if (title) {
      (input as any).title = () => isHydrated.value ? typeof title === 'function' ? title() : title : ''
    }
  }
  return useHead((() => {
    if (!isHydrated.value)
      return {}
    return resolveUnref(input)
  }) as UseHeadInput<T>, options)
}
