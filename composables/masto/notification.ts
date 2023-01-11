import type { WsEvents } from 'masto'

const notifications = reactive<Record<string, undefined | [Promise<WsEvents>, string[]]>>({})

export const useNotifications = () => {
  const id = currentUser.value?.account.id
  const masto = useMasto()

  async function clearNotifications() {
    if (!id || !notifications[id])
      return
    const lastReadId = notifications[id]![1][0]
    notifications[id]![1] = []

    await masto.v1.markers.create({
      notifications: { lastReadId },
    })
  }

  async function connect(): Promise<void> {
    if (!isMastoInitialised.value || !id || notifications[id] || !currentUser.value?.token)
      return

    const stream = masto.v1.stream.streamUser()
    notifications[id] = [stream, []]
    stream.then(s => s.on('notification', (n) => {
      if (notifications[id])
        notifications[id]![1].unshift(n.id)
    }))

    const position = await masto.v1.markers.fetch({ timeline: ['notifications'] })
    const paginator = masto.v1.notifications.list({ limit: 30 })
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
  if (isMastoInitialised.value)
    connect()
  else
    watchOnce(isMastoInitialised, connect)

  return {
    notifications: computed(() => id ? notifications[id]?.[1].length ?? 0 : 0),
    disconnect,
    clearNotifications,
  }
}
