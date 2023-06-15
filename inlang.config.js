export async function defineConfig(env) {
  const { default: i18next } = await env.$import(
    'https://cdn.jsdelivr.net/npm/@inlang/plugin-i18next@2/dist/index.js',
  )

  const { default: standardLintRules } = await env.$import(
    'https://cdn.jsdelivr.net/npm/@inlang/plugin-standard-lint-rules@3/dist/index.js',
  )

  return {
    referenceLanguage: 'en',
    plugins: [i18next({
      pathPattern: './locales/{language}.json',
    }), standardLintRules()],
  }
}
