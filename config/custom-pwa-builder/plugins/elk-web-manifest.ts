import type { VitePWAStrategy } from '@unplugin-pwa/core'
import type { SWType } from '@vite-pwa/workbox-build/types'
import type { Buffer } from 'node:buffer'
import type { Plugin } from 'vite'
import type { LocalizedWebManifest } from '../i18n'
import type { ViteLegacyNuxtPWAContext, ViteNuxtPWAContext } from '../internal-types'
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolve } from 'pathe'

interface PwaDevIcon {
  src: string
  type: string
}

interface ResolvedPwaDevIcon extends PwaDevIcon {
  data: Promise<Buffer>
}

export function ElkWebManifest<
  UserStrategy extends VitePWAStrategy,
  T extends SWType,
>(
  ctx: ViteNuxtPWAContext<UserStrategy, T> | ViteLegacyNuxtPWAContext<UserStrategy, T>,
  webManifests: LocalizedWebManifest,
): Plugin {
  return {
    name: 'elk:pwa:webmanifest',
    sharedDuringBuild: true,
    applyToEnvironment(environment) {
      return environment.config.consumer === 'client'
    },
    async generateBundle(_, bundle) {
      if (!ctx.envApi && ctx.viteConfig.build.ssr) {
        return
      }

      if (typeof this !== 'undefined' && typeof this.emitFile !== 'undefined') {
        for (const name of Object.keys(webManifests)) {
          this.emitFile({
            type: 'asset',
            fileName: `manifest-${name}.webmanifest`,
            source: `${JSON.stringify(webManifests[name], null, ctx.resolvedOptions.minify ? 0 : 2)}\n`,
          })
        }
      }
      else {
        for (const name of Object.keys(webManifests)) {
          // NOTE: assigning to bundle[foo] directly is discouraged by rollup
          // and is not supported by rolldown.
          // The api consumers should pass in the pluginCtx in the future
          bundle[`manifest-${name}.webmanifest`] = {
            // @ts-expect-error: for Vite 3 support, Vite 4 has removed `isAsset` property
            isAsset: true,
            type: 'asset',
            // fix vite 6 build with manifest enabled
            names: [],
            source: `${JSON.stringify(webManifests[name], null, ctx.resolvedOptions.minify ? 0 : 2)}\n`,
            fileName: `manifest-${name}.webmanifest`,
          }
        }
      }
    },
    configureServer(server) {
      if (!ctx.envApi && ctx.viteConfig.build.ssr) {
        return
      }
      const icons: PwaDevIcon[] = webManifests?.['en-US']?.icons as any
      const mappedIcons: PwaDevIcon[] = [
        ...icons.map(({ src, type }) => ({ src, type })),
        { src: 'favicon.ico', type: 'image/x-icon' },
        { src: 'apple-touch-icon.png', type: 'image/png' },
        { src: 'logo.svg', type: 'image/svg+xml' },
      ]

      const folder = dirname(fileURLToPath(import.meta.url))
      const useIcons = mappedIcons.reduce((acc, icon) => {
        icon.src = `${ctx.base}${icon.src}`
        acc[icon.src] = {
          ...icon,
          data: readFile(resolve(join(folder, '../../../public-dev', icon.src))),
        }
        return acc
      }, <Record<string, ResolvedPwaDevIcon>>{})
      const localeMatcher = new RegExp(`^${ctx.base}manifest-(.*).webmanifest$`)
      server.middlewares.use(async (req, res, next) => {
        const url = req.url
        if (!url)
          return next()

        const match = url.match(localeMatcher)
        const entry = match && webManifests[match[1]]
        if (entry) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/manifest+json')
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
          res.write(JSON.stringify(entry), 'utf-8')
          res.end()
          return
        }

        const icon = useIcons[url]
        if (!icon)
          return next()

        res.statusCode = 200
        res.setHeader('Content-Type', icon.type)
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
        res.write(await icon.data)
        res.end()
      })
    },
  }
}
