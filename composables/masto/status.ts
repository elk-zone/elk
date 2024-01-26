import type { mastodon } from 'masto'

type Action = 'reblogged' | 'favourited' | 'bookmarked' | 'pinned' | 'muted'
type CountField = 'reblogsCount' | 'favouritesCount'

export interface StatusActionsProps {
  status: mastodon.v1.Status
}

export function useStatusActions(props: StatusActionsProps) {
  let status = $ref<mastodon.v1.Status>({ ...props.status })
  const { client } = $(useMasto())

  watch(
    () => props.status,
    val => status = { ...val },
    { deep: true, immediate: true },
  )

  // Use different states to let the user press different actions right after the other
  const isLoading = $ref({
    reblogged: false,
    favourited: false,
    bookmarked: false,
    pinned: false,
    translation: false,
    muted: false,
  })

  async function toggleStatusAction(action: Action, fetchNewStatus: () => Promise<mastodon.v1.Status>, countField?: CountField) {
    // check login
    if (!checkLogin())
      return

    const prevCount = countField ? status[countField] : undefined

    isLoading[action] = true
    const isCancel = status[action]
    fetchNewStatus().then((newStatus) => {
      // when the action is cancelled, the count is not updated highly likely (if they're the same)
      // issue of Mastodon API
      if (isCancel && countField && prevCount === newStatus[countField])
        newStatus[countField] -= 1

      Object.assign(status, newStatus)
      cacheStatus(newStatus, undefined, true)
    }).finally(() => {
      isLoading[action] = false
    })
    // Optimistic update
    status[action] = !status[action]
    cacheStatus(status, undefined, true)
    if (countField)
      status[countField] += status[action] ? 1 : -1
  }

  const canReblog = $computed(() =>
    status.visibility !== 'direct'
    && (status.visibility !== 'private' || status.account.id === currentUser.value?.account.id),
  )

  const toggleReblog = () => toggleStatusAction(
    'reblogged',
    () => client.v1.statuses.$select(status.id)[status.reblogged ? 'unreblog' : 'reblog']().then((res) => {
      if (status.reblogged)
      // returns the original status
        return res.reblog!
      return res
    }),
    'reblogsCount',
  )

  const toggleFavourite = () => toggleStatusAction(
    'favourited',
    () => client.v1.statuses.$select(status.id)[status.favourited ? 'unfavourite' : 'favourite'](),
    'favouritesCount',
  )

  const toggleBookmark = () => toggleStatusAction(
    'bookmarked',
    () => client.v1.statuses.$select(status.id)[status.bookmarked ? 'unbookmark' : 'bookmark'](),
  )

  const togglePin = async () => toggleStatusAction(
    'pinned',
    () => client.v1.statuses.$select(status.id)[status.pinned ? 'unpin' : 'pin'](),
  )

  const toggleMute = async () => toggleStatusAction(
    'muted',
    () => client.v1.statuses.$select(status.id)[status.muted ? 'unmute' : 'mute'](),
  )

  return {
    status: $$(status),
    isLoading: $$(isLoading),
    canReblog: $$(canReblog),
    toggleMute,
    toggleReblog,
    toggleFavourite,
    toggleBookmark,
    togglePin,
  }
}
