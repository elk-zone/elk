import { writeFile } from 'node:fs/promises'
import fs from 'fs-extra'
import { ofetch } from 'ofetch'
import { join, resolve } from 'pathe'
import { elkTeamMembers } from '../composables/about'

const avatarsDir = resolve('./public/avatars/')

const sizes = [60, 100]

async function download(url: string, fileName: string) {
  console.log('downloading', fileName)
  try {
    const image = await ofetch(url, { responseType: 'arrayBuffer' })
    await writeFile(fileName, new Uint8Array(image))
  }
  catch (err) {
    console.error(err)
  }
}

async function fetchAvatars() {
  await fs.ensureDir(avatarsDir)

  await Promise.all(elkTeamMembers.reduce((acc, { github }) => {
    acc.push(...sizes.map(s => download(`https://github.com/${github}.png?size=${s}`, join(avatarsDir, `${github}-${s}x${s}.png`))))
    return acc
  }, [] as Promise<void>[]))
}

fetchAvatars()
