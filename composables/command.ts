import type { ComputedRef } from 'vue'
import { defineStore } from 'pinia'
import Fuse from 'fuse.js'
import type { LocaleObject } from '#i18n'

// @unocss-include

const scopes = [
  '',
  'Actions',
  'Tabs',
  'Navigation',
  'Preferences',
  'Account',
  'Languages',
  'Switch account',
  'Settings',
] as const

export type CommandScopeNames = typeof scopes[number]

export interface CommandScope {
  id: string
  display: string
}

export interface CommandProvider {
  parent?: string
  scope?: CommandScopeNames

  // smaller is higher priority
  order?: number
  visible?: () => unknown

  icon: string | (() => string)
  name: string | (() => string)
  description?: string | (() => string | undefined)

  bindings?: string[] | (() => string[])

  onActivate?: () => void
  onComplete?: () => CommandScope
}

export type ResolvedCommand =
  Exclude<CommandProvider, 'icon' | 'name' | 'description' | 'bindings'> & {
    icon: string
    name: string
    description: string | undefined
    bindings: string[] | undefined
  }

export type QueryIndexedCommand = ResolvedCommand & {
  index: number
}

const r = <T extends Object | undefined>(i: T | (() => T)): T =>
  typeof i === 'function' ? i() : i

export const useCommandRegistry = defineStore('command', () => {
  const providers = reactive(new Set<CommandProvider>())

  const commands = computed<ResolvedCommand[]>(() =>
    [...providers]
      .filter(command => command.visible ? command.visible() : true)
      .map(provider => ({
        ...provider,
        icon: r(provider.icon),
        name: r(provider.name),
        description: r(provider.description),
        bindings: r(provider.bindings),
      })))

  let lastScope = ''
  let lastFuse: Fuse<ResolvedCommand> | undefined

  watch(commands, () => {
    lastFuse = undefined
  })

  return {
    register: (provider: CommandProvider) => {
      providers.add(provider)
    },
    remove: (provider: CommandProvider) => {
      providers.delete(provider)
    },

    query: (scope: string, query: string) => {
      const cmds = commands.value
        .filter(cmd => (cmd.parent ?? '') === scope)

      if (query) {
        const fuse = lastScope === scope && lastFuse
          ? lastFuse
          : new Fuse(cmds, {
            keys: ['scope', 'name', 'description'],
            includeScore: true,
          })

        lastScope = scope
        lastFuse = fuse

        const res = fuse.search(query)
          .map(({ item }) => ({ ...item }))

        // group by scope
        const grouped = new Map<CommandScopeNames, QueryIndexedCommand[]>()
        for (const cmd of res) {
          const scope = cmd.scope ?? ''
          if (!grouped.has(scope))
            grouped.set(scope, [])
          grouped
            .get(scope)!
            .push({
              ...cmd,
              index: 0,
            })
        }

        let index = 0
        const indexed: QueryIndexedCommand[] = []
        for (const items of grouped.values()) {
          for (const cmd of items) {
            cmd.index = index++
            indexed.push(cmd)
          }
        }

        return {
          length: res.length,
          items: indexed,
          grouped,
        }
      }

      else {
        const indexed = cmds.map((cmd, index) => ({ ...cmd, index }))

        const grouped = new Map<CommandScopeNames, QueryIndexedCommand[]>(
          scopes.map(scope => [scope, []]))
        for (const cmd of indexed) {
          const scope = cmd.scope ?? ''
          grouped.get(scope)!.push(cmd)
        }

        let index = 0
        const sorted: QueryIndexedCommand[] = []
        for (const [scope, items] of grouped) {
          if (items.length === 0) {
            grouped.delete(scope)
          }
          else {
            const o = (cmd: QueryIndexedCommand) => (cmd.order ?? 0) * 100 + cmd.index
            items.sort((a, b) => o(a) - o(b))
            for (const cmd of items) {
              cmd.index = index++
              sorted.push(cmd)
            }
          }
        }

        return {
          length: indexed.length,
          items: sorted,
          grouped,
        }
      }
    },
  }
})

export const useCommand = (cmd: CommandProvider) => {
  const registry = useCommandRegistry()

  registry.register(cmd)

  const cleanup = () => registry.remove(cmd)

  onDeactivated(cleanup)
  tryOnScopeDispose(cleanup)
}

export const useCommands = (cmds: () => CommandProvider[]) => {
  const registry = useCommandRegistry()

  const commands = computed(cmds)

  watch(commands, (n, o = []) => {
    for (const cmd of o)
      registry.remove(cmd)
    for (const cmd of n)
      registry.register(cmd)
  }, { deep: true, immediate: true })

  const cleanup = () => {
    commands.value.forEach(cmd => registry.remove(cmd))
  }

  onDeactivated(cleanup)
  tryOnScopeDispose(cleanup)
}

export const provideGlobalCommands = () => {
  const { locale, t } = useI18n()
  const { locales } = useI18n() as { locales: ComputedRef<LocaleObject[]> }
  const users = useUsers()
  const masto = useMasto()
  const colorMode = useColorModeRef()

  useCommand({
    scope: 'Actions',

    visible: () => currentUser.value,

    name: () => t('action.compose'),
    icon: 'i-ri:quill-pen-line',
    description: () => t('command.compose_desc'),

    onActivate() {
      openPublishDialog()
    },
  })

  useCommand({
    scope: 'Preferences',

    name: () => t('command.toggle_dark_mode'),
    icon: () => colorMode.value === 'light' ? 'i-ri:sun-line' : 'i-ri:moon-line',

    onActivate() {
      colorMode.value = colorMode.value === 'light' ? 'dark' : 'light'
    },
  })

  useCommand({
    scope: 'Preferences',

    name: () => t('command.toggle_zen_mode'),
    icon: () => isZenMode.value ? 'i-ri:layout-right-2-line' : 'i-ri:layout-right-line',

    onActivate() {
      toggleZenMode()
    },
  })

  useCommand({
    scope: 'Preferences',

    name: () => t('command.select_lang'),
    icon: 'i-ri:earth-line',

    onComplete: () => ({
      id: 'language',
      display: 'Languages',
    }),
  })
  useCommands(() => locales.value.map(l => ({
    parent: 'language',
    scope: 'Languages',

    name: l.name!,
    icon: 'i-ri:earth-line',

    onActivate() {
      locale.value = l.code
    },
  })))

  useCommand({
    scope: 'Account',

    name: () => t('action.sign_in'),
    description: () => t('command.sign_in_desc'),
    icon: 'i-ri:user-add-line',

    onActivate() {
      openSigninDialog()
    },
  })
  useCommand({
    scope: 'Account',

    visible: () => users.value.length > 1,

    name: () => t('action.switch_account'),
    description: () => t('command.switch_account_desc'),
    icon: 'i-ri:user-shared-line',

    onComplete: () => ({
      id: 'account-switch',
      display: 'Accounts',
    }),
  })
  useCommands(() => users.value.map(user => ({
    parent: 'account-switch',
    scope: 'Switch account',

    visible: () => user.account.id !== currentUser.value?.account.id,

    name: () => t('command.switch_account', [getFullHandle(user.account)]),
    icon: 'i-ri:user-shared-line',

    onActivate() {
      masto.loginTo(user)
    },
  })))
  useCommand({
    scope: 'Account',

    visible: () => currentUser.value,

    name: () => t('user.sign_out_account', [getFullHandle(currentUser.value!.account)]),
    icon: 'i-ri:logout-box-line',

    onActivate() {
      signout()
    },
  })
}
