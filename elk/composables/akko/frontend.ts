import type { akkoma } from '@bdxtown/akko'
import { name } from './../../package.json'

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

  const client = useAkkoClient()

  async function update(configuration: FrontendConfiguration, isLoading: Ref<boolean> = ref(false)) {
    isLoading.value = true
    try {
      const response = await client.v1.pleroma.admin.config.create({
        configs: [{ group: ':pleroma', key: ':frontend_configurations', value: [{ tuple: [`:${name.replace(/[-@/]/g, '')}_fe`, { ...configuration }] }] }],
      })
      isLoading.value = false
      return response
    }
    catch (e) {
      console.error(e)
      // TODO: proper error handling
    }
    isLoading.value = false
  }

  return {
    config,
    update,
  }
}
