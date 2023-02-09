import type { Driver } from 'unstorage'
// @ts-expect-error unstorage needs to provide backwards-compatible subpath types
import _memory from 'unstorage/drivers/memory'
import { defineDriver } from 'unstorage'

const memory = _memory as typeof import('unstorage/dist/drivers/memory')['default']

export interface CacheDriverOptions {
  driver: Driver
}

export default defineDriver((driver: Driver = memory()) => {
  const memoryDriver = memory()
  return {
    ...driver,
    async hasItem(key: string) {
      if (await memoryDriver.hasItem(key))
        return true

      return driver.hasItem(key)
    },
    async setItem(key: string, value: any) {
      await Promise.all([
        memoryDriver.setItem(key, value),
        driver.setItem?.(key, value),
      ])
    },
    async getItem(key: string) {
      let value = await memoryDriver.getItem(key)

      if (value !== null)
        return value

      value = await driver.getItem(key)
      memoryDriver.setItem(key, value)

      return value
    },
  }
})
