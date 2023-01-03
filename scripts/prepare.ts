import { copy } from 'fs-extra'
import { emojiPrefix, iconifyEmojiPackage } from '../config/emojis'

const dereference = process.platform === 'win32' ? true : undefined

await copy('node_modules/shiki-es/dist/assets', 'public/shiki/', {
  dereference,
  filter: src => src === 'node_modules/shiki/' || src.includes('languages') || src.includes('dist'),
})
await copy('node_modules/theme-vitesse/themes', 'public/shiki/themes', { dereference })
await copy('node_modules/theme-vitesse/themes', 'node_modules/shiki/themes', { overwrite: true, dereference })
await copy(`node_modules/${iconifyEmojiPackage}/icons`, `public/emojis/${emojiPrefix}`, { overwrite: true, dereference })
