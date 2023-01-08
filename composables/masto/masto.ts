import type { ElkMasto } from '~/types'

export const useMasto = () => useNuxtApp().$masto as ElkMasto

export const isMastoInitialised = computed(() => process.client && useMasto().loggedIn.value)

export const onMastoInit = (cb: () => unknown) => {
  watchOnce(isMastoInitialised, () => {
    cb()
  }, { immediate: isMastoInitialised.value })
}
