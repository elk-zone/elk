import type { MaybeRef } from '@vueuse/shared'
import type { MaybeComputedRef, UseTimeAgoOptions } from '@vueuse/core'

const formatter = Intl.NumberFormat()

export const formattedNumber = (num: number, useFormatter: Intl.NumberFormat = formatter) => {
  return useFormatter.format(num)
}

export const useHumanReadableNumber = () => {
  const { t, n, locale } = useI18n()

  const fn = (num: number) => {
    if (num < 10000)
      return n(num, 'smallCounting', locale.value)

    // show 1 decimal: we cannot use toFixed(1), it is a string
    if (num < 1000000)
      return `${n(Math.floor(num / 100) / 10, 'kiloCounting', locale.value)}${t('common.kiloSuffix')}`

    // show 2 decimals: we cannot use toFixed(2), it is a string
    return `${n(Math.floor(num / 10000) / 100, 'millionCounting', locale.value)}${t('common.megaSuffix')}`
  }

  return {
    formatHumanReadableNumber: (num: MaybeRef<number>) => fn(unref(num)),
    formatNumber: (num: MaybeRef<number>) => n(unref(num), 'smallCounting', locale.value),
    formatPercentage: (num: MaybeRef<number>) => n(unref(num), 'percentage', locale.value),
    forSR: (num: MaybeRef<number>) => unref(num) > 10000,
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
  const { d, t, n: fnf, locale } = useI18n()
  const prefix = short ? 'short_' : ''

  const fn = (n: number, past: boolean, key: string) => {
    return t(`time_ago_options.${prefix}${key}_${past ? 'past' : 'future'}`, n, {
      named: {
        v: fnf(n, 'smallCounting', locale.value),
      },
    })
  }

  return {
    rounding: 'floor',
    showSecond: !short,
    updateInterval: short ? 60_000 : 1_000,
    messages: {
      justNow: t('time_ago_options.just_now'),
      // just return the value
      past: n => n,
      // just return the value
      future: n => n,
      second: (n, p) => fn(n, p, 'second'),
      minute: (n, p) => fn(n, p, 'minute'),
      hour: (n, p) => fn(n, p, 'hour'),
      day: (n, p) => fn(n, p, 'day'),
      week: (n, p) => fn(n, p, 'week'),
      month: (n, p) => fn(n, p, 'month'),
      year: (n, p) => fn(n, p, 'year'),
      invalid: '',
    },
    fullDateFormatter(date) {
      return d(date, short ? 'short' : 'long')
    },
  }
}
