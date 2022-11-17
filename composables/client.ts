import type { MastoClient } from 'masto'
import type { ClientState } from '~/plugins/store.client'

export function useMasto() {
  return useNuxtApp().$masto as Promise<MastoClient>
}

export function useClientState() {
  return useNuxtApp().$clientState as ClientState
}
