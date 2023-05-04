import { Store } from 'tauri-plugin-store-api'
import type { Ref } from 'vue'

export type TauriStoreRef<T> = Ref<T>

const store = new Store('settings.json')

async function tauriStoreRef<T>(store: Store, key: string, defaultValue: T): Promise<TauriStoreRef<T>> {
  let refValue = defaultValue
  const ref = customRef<T>((track, trigger) => {
    store.onKeyChange(key, (value) => {
      refValue = value as T
      trigger()
    }).then()

    return {
      get: () => {
        track()
        return refValue
      },
      set: async (value: T) => {
        await store.set(key, value)
        await store.save()
        refValue = value
        trigger()
      },
    }
  })

  const result = await store.get(key)
  if (result !== null)
    refValue = result as T

  return ref
}

export interface NativeSettings {
  minimizeToTray: TauriStoreRef<boolean>
}

export async function useNativeSettings(): Promise<NativeSettings> {
  return {
    minimizeToTray: await tauriStoreRef(store, 'minimize_to_tray', true),
  }
}
