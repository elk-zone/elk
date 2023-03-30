import type { WsEvents } from 'masto'

const notifications = reactive<Record<string, undefined | [Promise<WsEvents>, string[]]>>({})

export function useNotifications() {
  const id = currentUser.value?.account.id

  const { client, canStreaming } = $(useMasto())

  async function clearNotifications() {
    if (!id || !notifications[id])
      return
    const lastReadId = notifications[id]![1][0]
    notifications[id]![1] = []
    if (lastReadId) {
      await client.v1.markers.create({
        notifications: { lastReadId },
      })
    }
  }

  async function connect(): Promise<void> {
    if (!isHydrated.value || !id || notifications[id] || !currentUser.value?.token)
      return

    let resolveStream
    const stream = new Promise<WsEvents>(resolve => resolveStream = resolve)
    notifications[id] = [stream, []]

    await until($$(canStreaming)).toBe(true)

    client.v1.stream.streamUser().then(resolveStream)
    stream.then(s => s.on('notification', (n) => {
      if (notifications[id])
        notifications[id]![1].unshift(n.id)
    }))

    const position = await client.v1.markers.fetch({ timeline: ['notifications'] })
    const paginator = client.v1.notifications.list({ limit: 30 })
    do {
      const result = await paginator.next()
      if (!result.done && result.value.length) {
        for (const notification of result.value) {
          if (notification.id === position.notifications.lastReadId)
            return
          notifications[id]![1].push(notification.id)
        }
      }
      else {
        break
      }
    } while (true)
  }

  function disconnect(): void {
    if (!id || !notifications[id])
      return
    notifications[id]![0].then(stream => stream.disconnect())
    notifications[id] = undefined
  }

  watch(currentUser, disconnect)

  onHydrated(() => {
    connect()
  })

  return {
    notifications: computed(() => id ? notifications[id]?.[1].length ?? 0 : 0),
    disconnect,
    clearNotifications,
  }
}
