import { useI18n as useOriginalI18n } from 'vue-i18n'

export function useI18n() {
  if (process.server)
    return useOriginalI18n()

  const { t, ...rest } = useOriginalI18n()

  return { ...rest, t: wrapI18n(t) } satisfies ReturnType<typeof useOriginalI18n>
}

type GenericFunction = (...args: any[]) => any

export function wrapI18n<Func extends GenericFunction>(fn: Func): ((...args: Parameters<Func>) => ReturnType<Func>) {
  const wrappedFn = (...args: Parameters<Func>): ReturnType<Func> => {
    if (!isHydrated.value)
      return '' as ReturnType<Func>

    // console.log(args)

    return fn(...args)
  }
  return wrappedFn
}
