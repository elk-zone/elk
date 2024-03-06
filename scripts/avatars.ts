import { Buffer } from 'node:buffer'
import { join, resolve } from 'pathe'
import fs from 'fs-extra'
import { ofetch } from 'ofetch'
import { crabTeamMembers, elkTeamMembers } from '../composables/about'

const avatarsDir = resolve('./public/avatars/')

const sizes = [60, 100]

async function download(url: string, fileName: string) {
  if (fs.existsSync(fileName))
    return

  console.log('downloading', fileName)
  try {
    const image = await ofetch(url, { responseType: 'arrayBuffer' })
    await fs.writeFile(fileName, Buffer.from(image))
  }
  catch (err) {
    console.error(err)
  }
}

async function fetchAvatars() {
  await fs.ensureDir(avatarsDir)

  const allTeamMembers = [...elkTeamMembers, ...crabTeamMembers]

  await Promise.all(allTeamMembers.reduce((acc, { github }) => {
    acc.push(...sizes.map(s => download(`https://github.com/${github}.png?size=${s}`, join(avatarsDir, `${github}-${s}x${s}.png`))))
    return acc
  }, [] as Promise<void>[]))
}

fetchAvatars()
