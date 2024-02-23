import { useI18n as useOriginalI18n } from 'vue-i18n'

export function useI18n() {
  if (process.server)
    return useOriginalI18n()

  const { t, ...rest } = useOriginalI18n()

  return { ...rest, t: wrapI18n(t) } satisfies ReturnType<typeof useOriginalI18n>
}

export function wrapI18n<T extends (...args: any[]) => any>(t: T): T {
  return <T>((...args: any[]) => {
    return isHydrated.value ? t(...args) : ''
  })
}
