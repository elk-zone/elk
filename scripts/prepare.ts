import { cp, mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import process from 'node:process'
import { emojiPrefix, iconifyEmojiPackage } from '../config/emojis.ts'
import { colorsMap } from './generate-themes.ts'

const dereference = process.platform === 'win32'

const destEmojis = `public/emojis/${emojiPrefix}`
await mkdir(dirname(destEmojis), { recursive: true })
await cp(`node_modules/${iconifyEmojiPackage}/icons`, destEmojis, {
  force: true,
  dereference,
  recursive: true,
})

await writeFile(
  'app/constants/themes.json',
  `${JSON.stringify(colorsMap, null, 2)}\n`,
  { encoding: 'utf-8' },
)
await writeFile(
  'app/styles/default-theme.css',
  `:root {\n${Object.entries(colorsMap[0][1])
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')}\n}\n`,
  { encoding: 'utf-8' },
)
