const rtlChars = [
  /* arabic ranges */
  '\u0600-\u06FF',
  '\u0750-\u077F',
  '\uFB50-\uFDFF',
  '\uFE70-\uFEFF',
  /* hebrew range */
  '\u05D0-\u05FF',
].join('')

const reRTL = new RegExp(`[${rtlChars}]`, 'g')

export function isRtlText(text: string) {
  const rtl = text.match(reRTL)
  if (rtl == null || rtl.length === 0)
    return false

  // remove multi-lang characters from count
  const textCount = text.replace(/[0-9\s\\\/.,\-+="']/g, '').length
  return textCount > 0 && rtl.length >= (textCount - rtl.length)
}
