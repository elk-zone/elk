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

export const useTimeAgoOptions = (short = false): UseTimeAgoOptions<false> => {
  const { d, t } = useI18n()
  const prefix = short ? 'short_' : ''

  return {
    showSecond: !short,
    updateInterval: short ? 60_000 : 1_000,
    messages: {
      justNow: t('time_ago_options.just_now'),
      // just return the value
      past: n => n,
      // just return the value
      future: n => n,
      second: (n, p) => t(`time_ago_options.${prefix}second_${p ? 'past' : 'future'}`, n),
      minute: (n, p) => t(`time_ago_options.${prefix}minute_${p ? 'past' : 'future'}`, n),
      hour: (n, p) => t(`time_ago_options.${prefix}hour_${p ? 'past' : 'future'}`, n),
      day: (n, p) => t(`time_ago_options.${prefix}day_${p ? 'past' : 'future'}`, n),
      week: (n, p) => t(`time_ago_options.${prefix}week_${p ? 'past' : 'future'}`, n),
      month: (n, p) => t(`time_ago_options.${prefix}month_${p ? 'past' : 'future'}`, n),
      year: (n, p) => t(`time_ago_options.${prefix}year_${p ? 'past' : 'future'}`, n),
    },
    fullDateFormatter(date) {
      return d(date, short ? 'short' : 'long')
    },
  }
}

