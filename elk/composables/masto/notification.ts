import type { akkoma } from 'akko'

const notifications = reactive<Record<string, undefined | [Promise<akkoma.streaming.Subscription>, string[]]>>({})

export function useNotifications() {
  const id = currentUser.value?.account.id

  const { client, streamingClient } = useAkko()

  async function clearNotifications() {
    if (!id || !notifications[id])
      return

    const lastReadId = notifications[id]![1][0]
    notifications[id]![1] = []

    if (lastReadId) {
      await client.value.v1.markers.create({
        notifications: { lastReadId },
      })
    }
  }

  async function processNotifications(stream: akkoma.streaming.Subscription, id: string) {
    for await (const entry of stream) {
      if (entry.event === 'notification' && notifications[id])
        notifications[id]![1].unshift(entry.payload.id)
    }
  }

  async function connect(): Promise<void> {
    if (!isHydrated.value || !id || notifications[id] !== undefined || !currentUser.value?.token)
      return

    let resolveStream: ((value: akkoma.streaming.Subscription | PromiseLike<akkoma.streaming.Subscription>) => void) | undefined
    const streamPromise = new Promise<akkoma.streaming.Subscription>(resolve => resolveStream = resolve)
    notifications[id] = [streamPromise, []]

    await until(streamingClient).toBeTruthy()

    const stream = streamingClient.value!.user.subscribe()
    resolveStream!(stream)

    processNotifications(stream, id)

    const position = await client.value.v1.markers.fetch({ timeline: ['notifications'] })
    const paginator = client.value.v1.notifications.list({ limit: 30 })

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
    notifications[id]![0].then(stream => stream.unsubscribe())
    notifications[id] = undefined
  }

  watch(currentUser, disconnect)

  onHydrated(() => {
    connect()
  })

  return {
    notifications: computed(() => id ? notifications[id]?.[1].length ?? 0 : 0),
    clearNotifications,
  }
}
