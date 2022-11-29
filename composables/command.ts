import Fuse from 'fuse.js'

const scopes = [
  '',
  'Actions',
  'Navigation',
  'Preferences',
  'Account',

  'Languages',
  'Switch account',
] as const

export type CommandScope = typeof scopes[number]

export interface CommandParent {
  id: string
  display: string
}

export interface CommandProvider {
  parent?: string
  scope?: CommandScope

  // smaller is higher priority
  order?: number
  visible?: () => unknown

  icon: string | (() => string)
  name: string | (() => string)
  description?: string | (() => string | undefined)

  bindings?: string[] | (() => string[])

  onActivate?: () => void
  onComplete?: () => CommandParent
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

export const provideCommandRegistry = () => {
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
        const grouped = new Map<CommandScope, QueryIndexedCommand[]>()
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

        const grouped = new Map<CommandScope, QueryIndexedCommand[]>(
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
}

export const useCommandRegistry = () => {
  const { $command } = useNuxtApp()
  const registry = $command as ReturnType<typeof provideCommandRegistry>
  if (!registry)
    throw new Error('Command registry not found')

  return registry
}

export const useCommand = (cmd: CommandProvider) => {
  const registry = useCommandRegistry()

  registry.register(cmd)

  onScopeDispose(() => {
    registry.remove(cmd)
  })
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

  onScopeDispose(() => {
    commands.value.forEach(cmd => registry.remove(cmd))
  })
}
