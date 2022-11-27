const formatter = Intl.NumberFormat()

export const humanReadableNumber = (num: number) => {
  if (num < 10000)
    return formatter.format(num)

  if (num < 1000000)
    return `${Math.floor(num / 1000)}K`

  return `${Math.floor(num / 1000000)}M`
}

export const formattedNumber = (num: number) => {
  return formatter.format(num)
}
