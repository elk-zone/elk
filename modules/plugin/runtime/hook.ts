import type { SetupContext } from 'vue'
import type { SFCManifest } from '..'
import type { renderHelpers } from '../fixtures/vue'
import type { NuxtApp } from '#app'

let activeContext: HookContext | null = null

interface HookContext {
  nuxt: NuxtApp
  getManifest: (id: string) => SFCManifest | undefined
}

export function setHookContext(context: HookContext | null) {
  activeContext = context
}

export function getHookContext() {
  return activeContext
}

function getManifest(id: string) {
  return activeContext?.getManifest(id)
}

function decodeMapping<T = any>(varis: unknown[], mapping: string[]): T {
  return Object.fromEntries(
    varis.map((vari, i) => [mapping[i], vari]),
  ) as T
}

type AutoImportables = typeof import('#imports')
type SetupArgs = [Readonly<any>, SetupContext]
type SetupRefs = Partial<AutoImportables> & Record<string, any>
type RenderRefs = Partial<typeof renderHelpers> & Record<string, any>

export function autoImportDecl(id: string, name: string, init: unknown) {
  // const manifest = getManifest(id)
  // if (manifest) {
  // }

  return init
}

export function setupRef(id: string, args: SetupArgs, refs: unknown[]) {
  const manifest = getManifest(id)
  if (manifest) {
    // decode refs
    const decodedRefs = decodeMapping<SetupRefs>(refs, manifest.setupRefs)
  }

  return refs
}

export function setupDecl(id: string, decls: unknown[]) {
  const manifest = getManifest(id)
  if (manifest) {
    // decode decls
    const decodedDecls = decodeMapping(decls, manifest.setupDecls)
  }

  return decls
}

export function renderRef(id: string, args: unknown, refs: unknown[]) {
  const manifest = getManifest(id)
  if (manifest) {
    // decode refs
    const decodedRefs = decodeMapping<RenderRefs>(refs, manifest.renderRefs)
  }

  return refs
}
