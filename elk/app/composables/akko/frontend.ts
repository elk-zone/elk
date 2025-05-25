import { name } from './../../../package.json'

export interface FrontendConfiguration {
  links: {
    icon: string
    text: string
    url: string
  }[]
  theme?: [string, ThemeColors]
}

function sanitizeTheme(theme: any): FrontendConfiguration['theme'] {
  const colors = Object.keys(theme[1]).reduce((acc, curr) => {
    return {
      ...acc,
      [curr.replace(/_/g, '-')]: theme[1][curr],
    }
  }, {}) as ThemeColors
  return [theme[0], colors]
}

function sanitize(config: FrontendConfiguration | undefined): FrontendConfiguration | undefined {
  if (!config)
    return config
  return {
    ...config,
    theme: !config.theme ? undefined : sanitizeTheme(config.theme),
  }
}

export function useFrontendConfig(key: string = 'pleroma-config') {
  const { data: config } = useAsyncData<FrontendConfiguration | undefined>(
    key,
    async () => {
      const raw = await fetchFrontendConfiguration()
      return sanitize(raw)
    },
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
