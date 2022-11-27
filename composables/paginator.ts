import type { Paginator } from 'masto'
import { useDeactivated } from './lifecycle'
import type { PaginatorState } from '~/types'

export function usePaginator<T>(paginator: Paginator<any, T[]>) {
  const state = ref<PaginatorState>('idle')
  const items = ref<T[]>([])
  const newItems = ref<T[]>([])

  const endAnchor = ref<HTMLDivElement>()
  const bound = reactive(useElementBounding(endAnchor))
  const isInScreen = $computed(() => bound.top < window.innerHeight * 2)
  const error = ref<unknown | undefined>()
  const deactivated = useDeactivated()

  async function loadNext() {
    if (state.value !== 'idle')
      return

    state.value = 'loading'
    try {
      const result = await paginator.next()

      if (result.value?.length) {
        newItems.value = result.value
        items.value.push(...newItems.value)
        state.value = 'idle'
      }
      else {
        state.value = 'done'
      }
    }
    catch (e) {
      error.value = e
      state.value = 'error'
    }

    await nextTick()
    bound.update()
  }

  useIntervalFn(() => {
    bound.update()
  }, 1000)

  watch(
    () => isInScreen,
    () => {
      if (
        isInScreen
        && state.value === 'idle'
        // No new content is loaded when the keepAlive page enters the background
        && deactivated.value === false
      )
        loadNext()
    },
    { immediate: true },
  )

  return {
    items,
    newItems,
    state,
    error,
    endAnchor,
  }
}
