import { promises as fs } from 'node:fs'
import { defineEventHandler } from 'h3'
import { resolvePath } from '@nuxt/kit'
import { joinURL } from 'ufo'
import { useRuntimeConfig } from '#imports'

const headers: HeadersInit = {
  'cache-control': 'public, max-age=0, must-revalidate',
}

export default defineEventHandler(async ({ res }) => {
  const swDir = useRuntimeConfig().swDir
  const swPath = await resolvePath(joinURL(swDir, 'sw.js'))
  const s = await fs.stat(swPath)
  if (s && s.isFile()) {
    res.writeHead(200, {
      'content-type': 'application/javascript;charset=UTF-8',
      ...headers,
    })
    res.write(await fs.readFile(swPath, 'utf-8'))
  }
  else {
    res.writeHead(404, {
      ...headers,
    })
    res.write('Not Found')
  }
  res.end()
})
