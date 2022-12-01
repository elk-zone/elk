import type { MaybeComputedRef, UseTimeAgoOptions } from '@vueuse/core'

export const useFormattedDateTime = (
  value: MaybeComputedRef<string | Date | undefined | null>,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'long', timeStyle: 'medium' },
) => {
  const { locale } = useI18n()
  const formatter = $computed(() => Intl.DateTimeFormat(locale.value, options))
  return computed(() => {
    const v = resolveUnref(value)
    return v ? formatter.format(new Date(v)) : ''
  })
}

export const useTimeAgoOptions = (): UseTimeAgoOptions<false> => {
  const { d, t } = useI18n()

  return {
    showSecond: true,
    updateInterval: 1_000,
    messages: {
      justNow: t('time_ago_options.just_now'),
      // just return the value
      past: n => n,
      // just return the value
      future: n => n,
      second: (n, p) => t(`time_ago_options.${p ? 'past' : 'future'}_second`, n),
      minute: (n, p) => t(`time_ago_options.${p ? 'past' : 'future'}_minute`, n),
      hour: (n, p) => t(`time_ago_options.${p ? 'past' : 'future'}_hour`, n),
      day: (n, p) => t(`time_ago_options.${p ? 'past' : 'future'}_day`, n),
      week: (n, p) => t(`time_ago_options.${p ? 'past' : 'future'}_week`, n),
      month: (n, p) => t(`time_ago_options.${p ? 'past' : 'future'}_month`, n),
      year: (n, p) => t(`time_ago_options.${p ? 'past' : 'future'}_year`, n),
    },
    fullDateFormatter(date) {
      return d(date, 'long')
    },
  }
}
