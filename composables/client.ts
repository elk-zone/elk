import type { MastoClient } from 'masto'

export function useMasto() {
  return inject('masto') as Promise<MastoClient>
}
