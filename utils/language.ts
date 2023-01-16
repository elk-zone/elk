export function matchLanguages(languages: string[], acceptLanguages: readonly string[]): string | null {
  {
    const lang = acceptLanguages.map(userLang => languages.find(lang => lang.startsWith(userLang))).filter(v => !!v)[0]
    if (lang)
      return lang
  }

  const lang = acceptLanguages.map((userLang) => {
    userLang = userLang.split('-')[0]!
    return languages.find(lang => lang.startsWith(userLang))
  }).filter(v => !!v)[0]
  if (lang)
    return lang

  return null
}
