import type { MastoClient } from 'masto'
import type { AppStore } from '~~/plugins/store.client'

export function useMasto() {
  return inject('masto') as Promise<MastoClient>
}

export function useAppStore() {
  return inject('app-store') as AppStore
}
