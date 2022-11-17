import type { Paginator } from 'masto'
import type { PaginatorState } from '~/types'

export function usePaginator<T>(paginator: Paginator<any, T[]>) {
  const state = ref<PaginatorState>('idle')
  const items = ref<T[]>([])

  const endAnchor = ref<HTMLDivElement>()
  const bound = reactive(useElementBounding(endAnchor))
  const isInScreen = $computed(() => bound.top < window.innerHeight * 2)
  const error = ref<unknown | undefined>()

  async function loadNext() {
    if (state.value !== 'idle')
      return

    state.value = 'loading'
    try {
      const result = await paginator.next()

      if (result.value?.length) {
        items.value.push(...result.value)
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
      if (isInScreen && state.value === 'idle')
        loadNext()
    },
    { immediate: true },
  )

  return {
    items,
    state,
    error,
    endAnchor,
  }
}
