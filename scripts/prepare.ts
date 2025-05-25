import process from 'node:process'
import fs from 'fs-extra'
import { colorsMap } from './generate-themes'

await fs.writeJSON('constants/themes.json', colorsMap, { spaces: 2, EOL: '\n' })
await fs.writeFile('styles/default-theme.css', `:root {\n${Object.entries(colorsMap[0][1]).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n`, { encoding: 'utf-8' })
