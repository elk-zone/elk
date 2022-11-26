import type { MaybeRef } from '@vueuse/core'

export const useFormattedDateTime = (
  value: MaybeRef<string | Date | undefined>,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'long', timeStyle: 'medium' },
) => {
  const formatter = Intl.DateTimeFormat(undefined, options)
  return computed(() => {
    const v = resolveUnref(value)
    return v ? formatter.format(new Date(v)) : ''
  })
}
