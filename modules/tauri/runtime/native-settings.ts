import { Store } from 'tauri-plugin-store-api'

const store = new Store('settings.json')

export const useNativeSettings = () => store
