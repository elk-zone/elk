import type { akkoma } from '@bdxtown/akko'

export interface FrontendConfiguration {
  links: {
    icon: string
    text: string
    url: string
  }[]
}

export function useFrontendConfig() {
  const { data: config } = useAsyncData<FrontendConfiguration | undefined>(
    'pleroma-config',
    () => fetchFrontendConfiguration(),
    { watch: [isHydrated], immediate: isHydrated.value, default: () => shallowRef(undefined) },
  )

  return {
    config,
  }
}
