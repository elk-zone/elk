import type { MaybeRef } from '@vueuse/core'

export const useFormattedDateTime = (
  value: MaybeRef<string | Date>,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'long', timeStyle: 'medium' },
) => {
  const formatter = Intl.DateTimeFormat(undefined, options)
  return computed(() => formatter.format(new Date(resolveUnref(value))))
}
