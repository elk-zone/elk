export default defineNuxtConfig({
  app: {
    baseURL: '/docs',
  },
  experimental: {
    /**
     * TODO: investigate upstream the following error:
     * ```
     * [error] Unexpected token (Note that you need plugins to import files that are not JavaScript)
     * file: /opt/build/repo/docs/components/global/Logo.vue?vue&type=style&index=0&scoped=1f94f36b&lang.ts?inline&used:1:0
     * 1: .logo{display:flex;flex-direction:row;align-items:center;gap:0.5rem;font-size:1.5rem;}img{flex-shrink:0;aspect-ratio:...
     * ```
     */
    inlineSSRStyles: false,
  },
  extends: '@nuxt-themes/docus',
})
