import type { akkoma } from 'akko'

type Action = 'reblogged' | 'favourited' | 'bookmarked' | 'pinned' | 'muted'
type CountField = 'reblogsCount' | 'favouritesCount'

export interface StatusActionsProps {
  status: akkoma.v1.Status
}

export function useStatusActions(props: StatusActionsProps) {
  const status = ref<akkoma.v1.Status>({ ...props.status })
  const { client } = useAkko()

  watch(
    () => props.status,
    val => status.value = { ...val },
    { deep: true, immediate: true },
  )

  // Use different states to let the user press different actions right after the other
  const isLoading = ref({
    reblogged: false,
    favourited: false,
    bookmarked: false,
    pinned: false,
    translation: false,
    muted: false,
  })

  async function toggleStatusAction(action: Action, fetchNewStatus: () => Promise<akkoma.v1.Status>, countField?: CountField) {
    // check login
    if (!checkLogin())
      return

    const prevCount = countField ? status.value[countField] : undefined

    isLoading.value[action] = true
    const isCancel = status.value[action]
    fetchNewStatus().then((newStatus) => {
      // when the action is cancelled, the count is not updated highly likely (if they're the same)
      // issue of Mastodon API
      if (isCancel && countField && prevCount === newStatus[countField])
        newStatus[countField] -= 1

      Object.assign(status.value, newStatus)
      cacheStatus(newStatus, undefined, true)
    }).finally(() => {
      isLoading.value[action] = false
    })
    // Optimistic update
    status.value[action] = !status.value[action]
    cacheStatus(status.value, undefined, true)
    if (countField)
      status.value[countField] += status.value[action] ? 1 : -1
  }

  const canReblog = computed(() =>
    status.value.visibility !== 'direct'
    && (status.value.visibility !== 'private' || status.value.account.id === currentUser.value?.account.id),
  )

  const toggleReblog = () => toggleStatusAction(
    'reblogged',
    () => client.value.v1.statuses.$select(status.value.id)[status.value.reblogged ? 'unreblog' : 'reblog']().then((res) => {
      if (status.value.reblogged)
      // returns the original status
        return res.reblog!
      return res
    }),
    'reblogsCount',
  )

  const cleanMyReacts = async (): Promise<[boolean, PromiseRejectedResult | undefined]> => {
    // optimistic and start operate
    const myReacts = status.value.emojiReactions.filter(e => e.me)
    const theirReacts = status.value.emojiReactions.filter(e => !e.me)
    status.value.emojiReactions = [...theirReacts, ...myReacts.map(e => (e.count - 1 > 0 ? { ...e, count: e.count - 1 } : null))]
      .filter(e => !!e)

    let reqs = myReacts.map(e => client.value.v1.statuses.$select(status.value.id).unreact({ emoji: e.name }))
    if (status.value.favourited) {
      reqs = [...reqs, client.value.v1.statuses.$select(status.value.id).unfavourite()]
      status.value.favouritesCount -= 1
      status.value.favourited = false
    }
    cacheStatus(status.value, undefined, true)
    // actual edit
    const results = await Promise.allSettled(reqs) // we want to be able to stop if one of the request failed
    if (reqs.length > 0) {
      const afterStatus = await client.value.v1.statuses.$select(status.value.id).fetch()
      Object.assign(status.value, afterStatus)
      cacheStatus(status.value, undefined, true)
    }
    return [results.every(e => e.status === 'fulfilled'), results.find(e => e.status === 'rejected')]
  }

  const toggleReact = async (emoji: string) => {
    if (!checkLogin())
      return
    const removing = (emoji === '👍' && status.value.favourited) || status.value.emojiReactions.find(e => e.name === emoji && e.me)
    // status.value now contain up to date data
    const [cleanSuccess, cleanError] = await cleanMyReacts()
    if (!cleanSuccess) {
      throw cleanError?.reason
    }
    // if we were removing we stop there
    if (removing)
      return
    // optimistic update and operate
    let newStatusPromise
    if (emoji === '👍') {
      newStatusPromise = client.value.v1.statuses.$select(status.value.id).favourite()
      status.value.favouritesCount += 1
      status.value.favourited = true
    }
    else {
      newStatusPromise = client.value.v1.statuses.$select(status.value.id).react({ emoji })
      const previousReact = status.value.emojiReactions.find(e => e.name === emoji)
      if (previousReact) {
        status.value.emojiReactions = [...status.value.emojiReactions
          .filter(e => e.name === previousReact.name), {
          ...previousReact,
          me: true,
          count: previousReact.count + 1,
        }]
      }
      else {
        status.value.emojiReactions = [...status.value.emojiReactions, {
          count: 1,
          accountIds: [],
          me: true,
          name: emoji,
        }]
      }
    }
    cacheStatus(status.value, undefined, true)
    // real update
    try {
      Object.assign(status.value, await newStatusPromise)
      cacheStatus(status.value, undefined, true)
    }
    catch (e) {
      // if action failed we want to retrieve actual server data
      Object.assign(status.value, await client.value.v1.statuses.$select(status.value.id).fetch())
      cacheStatus(status.value, undefined, true)
      throw e
    }
  }

  const toggleBookmark = () => toggleStatusAction(
    'bookmarked',
    () => client.value.v1.statuses.$select(status.value.id)[status.value.bookmarked ? 'unbookmark' : 'bookmark'](),
  )

  const togglePin = async () => toggleStatusAction(
    'pinned',
    () => client.value.v1.statuses.$select(status.value.id)[status.value.pinned ? 'unpin' : 'pin'](),
  )

  const toggleMute = async () => toggleStatusAction(
    'muted',
    () => client.value.v1.statuses.$select(status.value.id)[status.value.muted ? 'unmute' : 'mute'](),
  )

  return {
    status,
    isLoading,
    canReblog,
    toggleReact,
    toggleMute,
    toggleReblog,
    toggleBookmark,
    togglePin,
  }
}
