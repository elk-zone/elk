import type { VitePWAStrategy } from '@unplugin-pwa/core'
import type { SWType } from '@vite-pwa/workbox-build/types'
import type { Plugin } from 'vite'
import type { ViteLegacyNuxtPWAContext, ViteNuxtPWAContext } from '../internal-types.ts'
import { exactRegex } from '@rolldown/pluginutils'

export function PwaRuntimeConfiguration<
  UserStrategy extends VitePWAStrategy,
  T extends SWType,
>(
  ctx: ViteNuxtPWAContext<UserStrategy, T> | ViteLegacyNuxtPWAContext<UserStrategy, T>,
): Plugin {
  const configuration = 'virtual:nuxt-pwa-configuration'
  const resolvedConfiguration = `\0${configuration}`
  return {
    name: 'vite-pwa:nuxt:runtime-configuration',
    enforce: 'pre',
    sharedDuringBuild: true,
    applyToEnvironment(environment) {
      return environment.config.consumer === 'client'
    },
    resolveId: {
      filter: {
        id: exactRegex(configuration),
      },
      handler(id) {
        if (id === configuration) {
          return resolvedConfiguration
        }
      },
    },
    load: {
      filter: {
        id: exactRegex(resolvedConfiguration),
      },
      handler(id) {
        if (id !== resolvedConfiguration) {
          return undefined
        }

        const { client } = ctx.nuxt

        let callBeforeRegisterHook = false
        const references: string[] = []
        const imports: string[] = []
        const functions: string[] = [
          `export function initializeDev() {}`,
          `export function activateSWSwitcherDev() {}`,
        ]
        if (ctx.devEnvironment) {
          if (!ctx.resolvedOptions.disable && ctx.resolvedOptions.devOptions?.enabled) {
            references.push('/// <reference types="@unplugin-pwa/vite/hmr-entry-point" />')
            imports.push('import { registerDevSW, setDevPWASwitcherReady } from \'virtual:pwa-entry-point-loaded\'')
            functions.length = 0
            functions.push(`export function initializeDev() { registerDevSW() }`)
            functions.push(`export function activateSWSwitcherDev() { setDevPWASwitcherReady() }`)
            if (ctx.dev.options!.swNames.hasNames) {
              callBeforeRegisterHook = true
            }
          }
        }
        else if (!ctx.resolvedOptions.disable) {
          callBeforeRegisterHook = true
        }

        const display = typeof ctx.resolvedOptions.manifest !== 'boolean'
          ? ctx.resolvedOptions.manifest?.display ?? 'standalone'
          : 'standalone'
        const installPrompt = (typeof client.installPrompt === 'undefined' || client.installPrompt === false)
          ? undefined
          : (client.installPrompt === true || client.installPrompt.trim() === '')
              ? 'vite-pwa:hide-install'
              : client.installPrompt.trim()

        const exports: string[] = [
          `export const callBeforeRegisterHook = ${callBeforeRegisterHook}`,
          `export const enabled = ${client.registerPlugin}`,
          `export const display = ${JSON.stringify(display)}`,
          `export const installPrompt = ${JSON.stringify(installPrompt)}`,
          `export const periodicSyncForUpdates = ${typeof client.periodicSyncForUpdates === 'number'
            ? client.periodicSyncForUpdates
            : 0}`,
        ]

        return `${references.join('\n')}
${imports.join('\n')}

${functions.join('\n')}

${exports.join('\n')}
`
      },
    },
  }
}
