import type { MaybeRef, MaybeRefOrGetter, UseTimeAgoOptions } from '@vueuse/core'

const formatter = Intl.NumberFormat()

export function formattedNumber(num: number, useFormatter: Intl.NumberFormat = formatter) {
  return useFormatter.format(num)
}

export function useHumanReadableNumber() {
  const { n, locale } = useI18n()

  const fn = (num: number) => {
    return n(
      num,
      num < 10000
        ? 'smallCounting'
        : num < 1000000
          ? 'kiloCounting'
          : 'millionCounting',
      locale.value,
    )
  }

  return {
    formatHumanReadableNumber: (num: MaybeRef<number>) => fn(unref(num)),
    formatNumber: (num: MaybeRef<number>) => n(unref(num), 'smallCounting', locale.value),
    formatPercentage: (num: MaybeRef<number>) => n(unref(num), 'percentage', locale.value),
    forSR: (num: MaybeRef<number>) => unref(num) > 10000,
  }
}

export function useFormattedDateTime(
  value: MaybeRefOrGetter<string | number | Date | undefined | null>,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'long', timeStyle: 'medium' },
) {
  const { locale } = useI18n()
  const formatter = computed(() => Intl.DateTimeFormat(locale.value, options))
  return computed(() => {
    const v = resolveUnref(value)
    return v ? formatter.value.format(new Date(v)) : ''
  })
}

export function useTimeAgoOptions(short = false): UseTimeAgoOptions<false> {
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
    updateInterval: short ? 60000 : 1000,
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

export function useFileSizeFormatter() {
  const { locale } = useI18n()

  const formatters = computed(() => ([
    Intl.NumberFormat(locale.value, {
      style: 'unit',
      unit: 'megabyte',
      unitDisplay: 'narrow',
      maximumFractionDigits: 0,
    }),
    Intl.NumberFormat(locale.value, {
      style: 'unit',
      unit: 'kilobyte',
      unitDisplay: 'narrow',
      maximumFractionDigits: 0,
    }),
  ]))

  const megaByte = 1024 * 1024

  function formatFileSize(size: number) {
    return size >= megaByte
      ? formatters.value[0].format(size / megaByte)
      : formatters.value[1].format(size / 1024)
  }

  return { formatFileSize }
}
