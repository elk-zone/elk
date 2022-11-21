export function useCacheStorage<T>(
  key: string,
  getter: () => T | Promise<T>,
  TTL = 1000 * 60 * 60 * 12, // 12 hours
) {
  const storage = useLocalStorage(key, {
    time: 0,
    value: null as T | null,
  })

  if (storage.value.time + TTL < Date.now()) {
    Promise.resolve(getter()).then((v) => {
      storage.value = {
        time: Date.now(),
        value: v,
      }
    })
  }

  return computed({
    get() {
      return storage.value.value
    },
    set(v) {
      storage.value.value = v
    },
  })
}
