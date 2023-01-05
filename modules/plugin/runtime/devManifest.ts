import type { SFCManifest } from '..'

const manifests = new Map<string, SFCManifest>()

export function provideManifest(id: string, manifest: SFCManifest) {
  manifests.set(id, manifest)
}

export function getManifest(id: string) {
  return manifests.get(id)
}
