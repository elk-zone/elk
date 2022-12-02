import type { Status } from 'masto'

type Action = 'reblogged' | 'favourited' | 'bookmarked' | 'pinned'
type CountField = 'reblogsCount' | 'favouritesCount'

export interface StatusActionsProps {
  status: Status
}

export function useStatusActions(props: StatusActionsProps) {
  let status = $ref<Status>({ ...props.status })

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
  })

  async function toggleStatusAction(action: Action, newStatus: () => Promise<Status>, countField?: CountField) {
    // check login
    if (!checkLogin())
      return
    // Optimistic update
    status[action] = !status[action]
    if (countField)
      status[countField] += status[action] ? 1 : -1

    try {
      isLoading[action] = true
      Object.assign(status, await newStatus())
    }
    finally {
      isLoading[action] = false
    }
  }
  const toggleReblog = () => toggleStatusAction(
    'reblogged',
    () => useMasto().statuses[status.reblogged ? 'unreblog' : 'reblog'](status.id).then((res) => {
      if (status.reblogged)
      // returns the original status
        return res.reblog!
      return res
    }),
    'reblogsCount',
  )

  const toggleFavourite = () => toggleStatusAction(
    'favourited',
    () => useMasto().statuses[status.favourited ? 'unfavourite' : 'favourite'](status.id),
    'favouritesCount',
  )

  const toggleBookmark = () => toggleStatusAction(
    'bookmarked',
    () => useMasto().statuses[status.bookmarked ? 'unbookmark' : 'bookmark'](status.id),
  )

  const togglePin = async () => toggleStatusAction(
    'pinned',
    () => useMasto().statuses[status.pinned ? 'unpin' : 'pin'](status.id),
  )

  return {
    status: $$(status),
    isLoading: $$(isLoading),
    toggleReblog,
    toggleFavourite,
    toggleBookmark,
    togglePin,
  }
}
