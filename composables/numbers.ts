import type { MaybeRef } from '@vueuse/shared'

const formatter = Intl.NumberFormat()

export const humanReadableNumber = (
  num: number,
  { k, m }: { k: string; m: string } = { k: 'K', m: 'M' },
  useFormatter: Intl.NumberFormat = formatter,
) => {
  if (num < 10000)
    return useFormatter.format(num)

  if (num < 1000000)
    return `${Math.floor(num / 1000)}${k}`

  return `${Math.floor(num / 1000000)}${m}`
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
