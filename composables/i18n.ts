import type { MaybeRef } from '@vueuse/shared'
import type { MaybeComputedRef, UseTimeAgoOptions } from '@vueuse/core'

const formatter = Intl.NumberFormat()

const humanReadableNumber = (
  num: number,
  { k, m }: { k: string; m: string } = { k: 'K', m: 'M' },
  useFormatter: Intl.NumberFormat = formatter,
) => {
  if (num < 10000)
    return useFormatter.format(num)

  // show 1 decimal: we cannot use toFixed(1), it is a string
  if (num < 1000000)
    return `${useFormatter.format(Math.floor(num / 100) / 10)}${k}`

  // show 2 decimals: we cannot use toFixed(2), it is a string
  return `${useFormatter.format(Math.floor(num / 10000) / 100)}${m}`
}

export const formattedNumber = (num: number, useFormatter: Intl.NumberFormat = formatter) => {
  return useFormatter.format(num)
}

export const useHumanReadableNumber = () => {
  const i18n = useI18n()
  const numberFormatter = $computed(() => Intl.NumberFormat(i18n.locale.value))
  return {
    formatHumanReadableNumber: (num: MaybeRef<number>) => {
      return humanReadableNumber(
        unref(num),
        { k: i18n.t('common.kiloSuffix'), m: i18n.t('common.megaSuffix') },
        numberFormatter,
      )
    },
    formatNumber: (num: MaybeRef<number>) => {
      return formattedNumber(
        unref(num),
        numberFormatter,
      )
    },
    forSR: (num: MaybeRef<number>) => {
      return unref(num) > 10000
    },
  }
}

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

