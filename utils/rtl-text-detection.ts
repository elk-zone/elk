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
  const textCount = text.replace(/[0-9\s\\\/.,\-+="']/g, '').length
  // remove multi-lang characters from count
  const rtlCount = (text.match(reRTL) || []).length
  return rtlCount >= (textCount - rtlCount) && textCount > 0
}
