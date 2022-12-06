import { promises as fs } from 'node:fs'
import { defineEventHandler } from 'h3'
import { resolvePath } from '@nuxt/kit'
import { joinURL } from 'ufo'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const { swDir, swName } = useRuntimeConfig()
  const swPath = await resolvePath(joinURL(swDir, swName))
  const stats = await fs.stat(swPath)

  if (stats?.isFile()) {
    setHeaders(event, {
      'content-type': 'application/javascript;charset=UTF-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    })
    return await fs.readFile(swPath, 'utf-8')
  }

  throw createError({
    statusCode: 404,
    statusMessage: 'Not Found',
  })
})
