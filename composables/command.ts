import type { LocaleObject } from '@nuxtjs/i18n'
import type { ComputedRef } from 'vue'
import type { SearchResult } from '~/composables/masto/search'
import Fuse from 'fuse.js'
import { defineStore } from 'pinia'

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
  'Hashtags',
  'Users',
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

export type ResolvedCommand = Exclude<CommandProvider, 'icon' | 'name' | 'description' | 'bindings'> & {
  icon: string
  name: string
  description: string | undefined
  bindings: string[] | undefined
}

// TODO: define a type for command arg
export type CommandHandler<T = void> = (arg: T) => void

export interface BaseQueryResultItem {
  index: number
  type: string
  scope?: CommandScopeNames
  onActivate?: () => void
  onComplete?: () => CommandScope
}

export interface SearchQueryResultItem extends BaseQueryResultItem {
  type: 'search'
  search: SearchResult
}

export interface CommandQueryResultItem extends BaseQueryResultItem {
  type: 'command'
  cmd: ResolvedCommand
}

export type QueryResultItem = SearchQueryResultItem | CommandQueryResultItem

export interface QueryResult {
  length: number
  items: QueryResultItem[]
  grouped: Map<CommandScopeNames, QueryResultItem[]>
}

function resolveFunction<T>(i: T): T extends () => infer R ? R : T {
  return typeof i === 'function' ? i() : i
}

export const useCommandRegistry = defineStore('command', () => {
  const providers = reactive(new Set<CommandProvider>())

  const commands = computed<ResolvedCommand[]>(() =>
    [...providers]
      .filter(command => command.visible ? command.visible() : true)
      .map(provider => ({
        ...provider,
        icon: resolveFunction(provider.icon),
        name: resolveFunction(provider.name),
        description: resolveFunction(provider.description),
        bindings: resolveFunction(provider.bindings),
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

    query: (scope: string, query: string): QueryResult => {
      const cmds = commands.value
        .filter(cmd => (cmd.parent ?? '') === scope)

      if (query) {
        const fuse = (lastScope === scope && lastFuse)
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
        const grouped = new Map<CommandScopeNames, CommandQueryResultItem[]>()
        for (const cmd of res) {
          const scope = cmd.scope ?? ''
          if (!grouped.has(scope))
            grouped.set(scope, [])
          grouped
            .get(scope)!
            .push({
              index: 0,
              type: 'command',
              scope,
              cmd,
              onActivate: cmd.onActivate,
              onComplete: cmd.onComplete,
            })
        }

        let index = 0
        const indexed: CommandQueryResultItem[] = []
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

        const grouped = new Map<CommandScopeNames, CommandQueryResultItem[]>(
          scopes.map(scope => [scope, []]),
        )
        for (const cmd of indexed) {
          const scope = cmd.scope ?? ''
          grouped.get(scope)!.push({
            index: cmd.index,
            type: 'command',
            scope,
            cmd,
            onActivate: cmd.onActivate,
            onComplete: cmd.onComplete,
          })
        }

        let index = 0
        const sorted: CommandQueryResultItem[] = []
        for (const [scope, items] of grouped) {
          if (items.length === 0) {
            grouped.delete(scope)
          }
          else {
            const o = (item: CommandQueryResultItem) => (item.cmd.order ?? 0) * 100 + item.index
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

export function useCommand(cmd: CommandProvider) {
  const registry = useCommandRegistry()

  const register = () => registry.register(cmd)
  const cleanup = () => registry.remove(cmd)

  register()
  onActivated(register)
  onDeactivated(cleanup)
  tryOnScopeDispose(cleanup)
}

export function useCommands(cmds: () => CommandProvider[]) {
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

export function provideGlobalCommands() {
  const { locale, t } = useI18n()
  const { locales } = useI18n() as { locales: ComputedRef<LocaleObject[]> }
  const users = useUsers()
  const masto = useMasto()
  const colorMode = useColorMode()
  const userSettings = useUserSettings()
  const { singleInstanceServer, oauth } = useSignIn()

  useCommand({
    scope: 'Preferences',

    name: () => t('command.toggle_dark_mode'),
    icon: () => colorMode.value === 'light' ? 'i-ri:sun-line' : 'i-ri:moon-line',

    onActivate() {
      colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
    },
  })

  useCommand({
    scope: 'Preferences',

    name: () => t('command.toggle_zen_mode'),
    icon: () => userSettings.value.preferences.zenMode ? 'i-ri:layout-right-2-line' : 'i-ri:layout-right-line',

    onActivate() {
      togglePreferences('zenMode')
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
      if (singleInstanceServer)
        oauth()
      else
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
      loginTo(masto, user)
    },
  })))
  useCommand({
    scope: 'Account',

    visible: () => currentUser.value,

    name: () => t('user.sign_out_account', [getFullHandle(currentUser.value!.account)]),
    icon: 'i-ri:logout-box-line',

    onActivate() {
      signOut()
    },
  })
}
