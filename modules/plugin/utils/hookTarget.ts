import type { ElkPluginHooks } from '../kit'

export interface HookTarget<T extends ElkPluginHooks = any> {
  on<K extends keyof T>(hook: K, fn: T[K]): () => void
  off<K extends keyof T>(hook: K, fn: T[K]): void
  emit<K extends keyof T>(hook: K, ...args: Parameters<T[K]>): void
}

export function createHookTarget<T extends ElkPluginHooks = any>(): HookTarget<T> {
  const hooks = new Map<keyof T, Set<T[keyof T]>>()
  return {
    on(hook, fn) {
      let set = hooks.get(hook)
      if (!set) {
        set = new Set()
        hooks.set(hook, set)
      }
      set.add(fn)
      return () => {
        set?.delete(fn)
      }
    },
    off(hook, fn) {
      const set = hooks.get(hook)
      if (set)
        set.delete(fn)
    },
    emit(hook, ...args) {
      const set = hooks.get(hook)
      if (set)
        set.forEach(fn => fn(...args))
    },
  }
}
