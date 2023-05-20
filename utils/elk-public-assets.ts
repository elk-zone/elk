export function isElkPublicAsset(path: string) {
  return path.startsWith('/_nuxt/')
    || path.startsWith('/avatars/')
    || path.startsWith('/emojis/')
    || path.startsWith('/fonts/')
    || path.startsWith('/screenshots/')
    || path.startsWith('/shiki/')
    || path.startsWith('/manifest-')
    || path === '/sw.js'
    || /^\/(apple-touch-icon|elk-og|favicon|logo|maskable-icon|pwa-192x192|pwa-512x512|robots)\.(png|ico|svg|txt)$/.test(path)
}
