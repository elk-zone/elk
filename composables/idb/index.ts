import type { MaybeRefOrGetter, RemovableRef } from '@vueuse/core'
import type { UseIDBOptions } from '@vueuse/integrations/useIDBKeyval'
import { del, get, set, update } from '~/utils/elk-idb'

export interface UseAsyncIDBKeyvalReturn<T> {
  set: (value: T) => Promise<void>
  readIDB: () => Promise<T | undefined>
}

export async function useAsyncIDBKeyval<T>(
  key: IDBValidKey,
  initialValue: MaybeRefOrGetter<T>,
  source: RemovableRef<T>,
  options: Omit<UseIDBOptions, 'shallow'> = {},
): Promise<UseAsyncIDBKeyvalReturn<T>> {
  const {
    flush = 'pre',
    deep = true,
    writeDefaults = true,
    onError = (e: unknown) => {
      console.error(e)
    },
  } = options

  const rawInit: T = toValue<T>(initialValue)

  try {
    const rawValue = await get<T>(key)
    if (rawValue === undefined) {
      if (rawInit !== undefined && rawInit !== null && writeDefaults) {
        await set(key, rawInit)
        source.value = rawInit
      }
    }
    else {
      source.value = rawValue
    }
  }
  catch (e) {
    onError(e)
  }

  async function write(data: T) {
    try {
      if (data == null) {
        await del(key)
      }
      else {
        // IndexedDB does not support saving proxies, convert from proxy before saving
        await update(key, () => toRaw(data))
      }
    }
    catch (e) {
      onError(e)
    }
  }

  const {
    pause: pauseWatch,
    resume: resumeWatch,
  } = watchPausable(source, data => write(data), { flush, deep })

  async function setData(value: T): Promise<void> {
    pauseWatch()
    try {
      await write(value)
      source.value = value
    }
    finally {
      resumeWatch()
    }
  }

  return { set: setData, readIDB: () => get<T>(key) }
}
