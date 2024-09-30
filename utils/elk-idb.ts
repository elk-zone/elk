import {
  del as delIdb,
  get as getIdb,
  promisifyRequest,
  set as setIdb,
  update as updateIdb,
  type UseStore,
} from 'idb-keyval'

const databases: IDBOpenDBRequest[] = []

function createStore(): UseStore {
  const storeName = 'keyval'
  const request = indexedDB.open('keyval-store')
  databases.push(request)
  request.onupgradeneeded = () => request.result.createObjectStore(storeName)
  const dbp = promisifyRequest(request)
  return (txMode, callback) => dbp.then(db => callback(db.transaction(storeName, txMode).objectStore(storeName)))
}

let defaultGetStoreFunc: UseStore | undefined
function defaultGetStore() {
  if (!defaultGetStoreFunc)
    defaultGetStoreFunc = createStore()

  return defaultGetStoreFunc
}

export function get<T = any>(key: IDBValidKey) {
  return getIdb<T>(key, defaultGetStore())
}

export function set(key: IDBValidKey, value: any) {
  return setIdb(key, value, defaultGetStore())
}

export function update<T = any>(key: IDBValidKey, updater: (oldValue: T | undefined) => T) {
  return updateIdb(key, updater, defaultGetStore())
}

export function del(key: IDBValidKey) {
  return delIdb(key, defaultGetStore())
}

export function closeDatabases() {
  databases.forEach((db) => {
    if (db.result)
      db.result.close()
  })
  defaultGetStoreFunc = undefined
}
