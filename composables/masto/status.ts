import type { mastodon } from 'masto'

type Action = 'reblogged' | 'favourited' | 'bookmarked' | 'pinned' | 'muted'
type CountField = 'reblogsCount' | 'favouritesCount'

export interface StatusActionsProps {
  status: mastodon.v1.Status
}

export function useStatusActions(props: StatusActionsProps) {
  const status = ref<mastodon.v1.Status>({ ...props.status })
  const { client } = useMasto()

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

  async function toggleStatusAction(action: Action, fetchNewStatus: () => Promise<mastodon.v1.Status>, countField?: CountField) {
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

      Object.assign(status, newStatus)
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

  const toggleFavourite = () => toggleStatusAction(
    'favourited',
    () => client.value.v1.statuses.$select(status.value.id)[status.value.favourited ? 'unfavourite' : 'favourite'](),
    'favouritesCount',
  )

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
    toggleMute,
    toggleReblog,
    toggleFavourite,
    toggleBookmark,
    togglePin,
  }
}
