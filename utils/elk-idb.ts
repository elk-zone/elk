import { del as delIdb, get as getIdb, promisifyRequest, set as setIdb, update as updateIdb } from 'idb-keyval'
import type { UseStore } from 'idb-keyval'

const databases: IDBDatabase[] = []

function createStore(): UseStore {
  const storeName = 'keyval'
  const request = indexedDB.open('keyval-store')
  databases.push(request.result)
  request.onupgradeneeded = () => request.result.createObjectStore(storeName)
  const dbp = promisifyRequest(request)
  return (txMode, callback) => dbp.then(db => callback(db.transaction(storeName, txMode).objectStore(storeName)))
}

export function get<T = any>(key: IDBValidKey) {
  return getIdb<T>(key, createStore())
}

export function set(key: IDBValidKey, value: any) {
  return setIdb(key, value, createStore())
}

export function update<T = any>(key: IDBValidKey, updater: (oldValue: T | undefined) => T) {
  return updateIdb(key, updater, createStore())
}

export function del(key: IDBValidKey) {
  return delIdb(key, createStore())
}

export function closeDatabases() {
  databases.forEach(db => db.close())
}
