import type { MastoClient } from 'masto'

export const useMasto = () => useNuxtApp().$masto.api as MastoClient

export const setMasto = (masto: MastoClient) => {
  useNuxtApp().$masto?.replace(masto)
}
