import type { MaybeRefOrGetter } from '@vueuse/core'
import type { Ref } from 'vue'
import type { UseIDBOptions } from '@vueuse/integrations/useIDBKeyval'
import { del, get, set, update } from '~/utils/elk-idb'

const isIDBSupported = !process.test && typeof indexedDB !== 'undefined'

export async function useAsyncIDBKeyval<T>(
  key: IDBValidKey,
  initialValue: MaybeRefOrGetter<T>,
  options: UseIDBOptions = {},
  source?: Ref<T>,
): Promise<void> {
  const {
    flush = 'pre',
    deep = true,
    shallow,
    writeDefaults = true,
    onError = (e: unknown) => {
      console.error(e)
    },
  } = options

  const data = source ?? (shallow ? shallowRef : ref)(initialValue) as Ref<T>

  const rawInit: T = toValue<T>(initialValue)

  async function read() {
    if (!isIDBSupported)
      return
    try {
      const rawValue = await get<T>(key)
      if (rawValue === undefined) {
        if (rawInit !== undefined && rawInit !== null && writeDefaults) {
          await set(key, rawInit)
          data.value = rawInit
        }
      }
      else {
        data.value = rawValue
      }
    }
    catch (e) {
      onError(e)
    }
  }

  await read()

  async function write() {
    if (!isIDBSupported)
      return
    try {
      if (data.value == null) {
        await del(key)
      }
      else {
        // IndexedDB does not support saving proxies, convert from proxy before saving
        if (Array.isArray(data.value))
          await update(key, () => (JSON.parse(JSON.stringify(data.value))))
        else if (typeof data.value === 'object')
          await update(key, () => ({ ...data.value }))
        else
          await update(key, () => (data.value))
      }
    }
    catch (e) {
      onError(e)
    }
  }

  watch(data, () => write(), { flush, deep })
}
