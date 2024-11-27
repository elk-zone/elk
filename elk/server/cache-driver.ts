import type { Driver } from 'unstorage'
import { defineDriver } from 'unstorage'
import memory from 'unstorage/drivers/memory'

export interface CacheDriverOptions {
  driver: Driver
}

export default defineDriver((driver: Driver = memory()) => {
  const memoryDriver = memory()
  return {
    ...driver,
    async hasItem(key: string) {
      if (await memoryDriver.hasItem(key, {}))
        return true

      return driver.hasItem(key, {})
    },
    async setItem(key: string, value: any) {
      await Promise.all([
        memoryDriver.setItem?.(key, value, {}),
        driver.setItem?.(key, value, {}),
      ])
    },
    async getItem(key: string) {
      let value = await memoryDriver.getItem(key)

      if (value !== null)
        return value

      value = await driver.getItem(key)
      memoryDriver.setItem?.(key, value as string, {})

      return value
    },
  }
})
