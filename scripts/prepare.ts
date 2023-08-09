import process from 'node:process'
import fs from 'fs-extra'
import { emojiPrefix, iconifyEmojiPackage } from '../config/emojis'
import { colorsMap } from './generate-themes'

const dereference = process.platform === 'win32' ? true : undefined

await fs.copy('node_modules/shiki-es/dist/assets', 'public/shiki/', {
  dereference,
  filter: src => src === 'node_modules/shiki/' || src.includes('languages') || src.includes('dist'),
})
await fs.copy('node_modules/theme-vitesse/themes', 'public/shiki/themes', { dereference })
await fs.copy('node_modules/theme-vitesse/themes', 'node_modules/shiki/themes', { overwrite: true, dereference })
await fs.copy(`node_modules/${iconifyEmojiPackage}/icons`, `public/emojis/${emojiPrefix}`, { overwrite: true, dereference })

await fs.writeJSON('constants/themes.json', colorsMap, { spaces: 2, EOL: '\n' })
await fs.writeFile('styles/default-theme.css', `:root {\n${Object.entries(colorsMap[0][1]).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`, { encoding: 'utf-8' })
