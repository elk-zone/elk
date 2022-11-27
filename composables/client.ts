import type { MastoClient } from 'masto'

export const useMasto = () => useNuxtApp().$masto.api

export const setMasto = (masto: MastoClient) => {
  useNuxtApp().$masto?.replace(masto)
}
