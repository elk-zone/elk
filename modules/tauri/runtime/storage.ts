import { createStorage } from 'unstorage'
import { Store } from 'tauri-plugin-store-api'

const store = new Store('.servers.dat')
const storage = createStorage()
storage.mount('servers', {
  getKeys() {
    return store.keys()
  },
  async removeItem(key: string) {
    await store.delete(key)
  },
  clear() {
    return store.clear()
  },
  hasItem(key: string) {
    return store.has(key)
  },
  setItem(key: string, value: any) {
    return store.set(key, value)
  },
  getItem(key: string) {
    return store.get(key)
  },
})

export const useStorage = () => storage
