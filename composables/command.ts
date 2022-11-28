import Fuse from 'fuse.js'

export interface CommandProvider {
  parent?: string
  scope?: string

  visible?: () => boolean

  id: string | (() => string)
  icon: string | (() => string)
  name: string | (() => string)
  description?: string | (() => string)

  bindings?: string[] | (() => string[])

  onActivate?: () => void
}

export type ResolvedCommand =
  Exclude<CommandProvider, 'id' | 'icon' | 'name' | 'description' | 'bindings'> & {
    id: string
    icon: string
    name: string
    description: string | undefined
    bindings: string[] | undefined
  }

export type IndexedCommand = ResolvedCommand & {
  index: number
}

const r = <T extends Object | undefined>(i: T | (() => T)): T =>
  typeof i === 'function' ? i() : i

export const provideCommandRegistry = () => {
  const providers = reactive(new Set<CommandProvider>())

  const commands = computed<ResolvedCommand[]>(() =>
    [...providers]
      .map(provider => ({
        ...provider,
        id: r(provider.id),
        icon: r(provider.icon),
        name: r(provider.name),
        description: r(provider.description),
        bindings: r(provider.bindings),
      }))
      .filter(command => command.visible?.() ?? true))

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

      const search = (query: string) => {
        const fuse = lastScope === scope && lastFuse
          ? lastFuse
          : new Fuse(cmds, {
            keys: ['name', 'description'],
          })

        lastScope = scope
        lastFuse = fuse

        return fuse.search(query)
          .map(result => result.item)
      }

      const res = query ? search(query) : cmds

      const indexed = res.map((cmd, index) => ({ ...cmd, index }))

      // group by scope
      const grouped = indexed.reduce((acc, cmd) => {
        const scope = cmd.scope ?? ''
        if (!acc.has(scope))
          acc.set(scope, [])
        acc.get(scope)!.push(cmd)
        return acc
      }, new Map<string, IndexedCommand[]>())

      return {
        length: res.length,
        items: indexed,
        grouped,
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
