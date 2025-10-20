import type { mastodon } from 'masto'
import type { Ref } from 'vue'

export function useScheduledStatuses() {
  const { client } = useMasto()
  const scheduledStatuses = ref<mastodon.v1.ScheduledStatus[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchScheduledStatuses(params?: {
    maxId?: string
    sinceId?: string
    minId?: string
    limit?: number
  }) {
    isLoading.value = true
    error.value = null

    try {
      const statuses = await client.value.v1.scheduledStatuses.list(params)
      scheduledStatuses.value = statuses
      return statuses
    }
    catch (err) {
      console.error('Failed to fetch scheduled statuses:', err)
      error.value = (err as Error).message
      return []
    }
    finally {
      isLoading.value = false
    }
  }

  async function getScheduledStatus(id: string) {
    try {
      return await client.value.v1.scheduledStatuses.$select(id).fetch()
    }
    catch (err) {
      console.error(`Failed to fetch scheduled status ${id}:`, err)
      error.value = (err as Error).message
      return null
    }
  }

  async function cancelScheduledStatus(id: string) {
    try {
      await client.value.v1.scheduledStatuses.$select(id).remove()
      // Remove from local state
      scheduledStatuses.value = scheduledStatuses.value.filter(s => s.id !== id)
      return true
    }
    catch (err) {
      console.error(`Failed to cancel scheduled status ${id}:`, err)
      error.value = (err as Error).message
      return false
    }
  }

  async function updateScheduledStatus(id: string, scheduledAt: string) {
    try {
      const updated = await client.value.v1.scheduledStatuses.$select(id).update({
        scheduledAt,
      })
      // Update in local state
      const index = scheduledStatuses.value.findIndex(s => s.id === id)
      if (index !== -1)
        scheduledStatuses.value[index] = updated

      return updated
    }
    catch (err) {
      console.error(`Failed to update scheduled status ${id}:`, err)
      error.value = (err as Error).message
      return null
    }
  }

  return {
    scheduledStatuses,
    isLoading,
    error,
    fetchScheduledStatuses,
    getScheduledStatus,
    cancelScheduledStatus,
    updateScheduledStatus,
  }
}

export interface ScheduledStatusActionsProps {
  scheduledStatus: mastodon.v1.ScheduledStatus
}

export function useScheduledStatusActions(props: ScheduledStatusActionsProps) {
  const scheduledStatus = ref<mastodon.v1.ScheduledStatus>({ ...props.scheduledStatus })
  const { client } = useMasto()
  const isDeleting = ref(false)
  const isUpdating = ref(false)

  watch(
    () => props.scheduledStatus,
    val => scheduledStatus.value = { ...val },
    { deep: true, immediate: true },
  )

  async function cancelScheduledStatus() {
    if (!checkLogin())
      return false

    isDeleting.value = true
    try {
      await client.value.v1.scheduledStatuses.$select(scheduledStatus.value.id).remove()
      return true
    }
    catch (err) {
      console.error('Failed to cancel scheduled status:', err)
      return false
    }
    finally {
      isDeleting.value = false
    }
  }

  async function updateScheduledTime(newScheduledAt: string) {
    if (!checkLogin())
      return null

    isUpdating.value = true
    try {
      const updated = await client.value.v1.scheduledStatuses.$select(scheduledStatus.value.id).update({
        scheduledAt: newScheduledAt,
      })
      scheduledStatus.value = updated
      return updated
    }
    catch (err) {
      console.error('Failed to update scheduled status:', err)
      return null
    }
    finally {
      isUpdating.value = false
    }
  }

  return {
    scheduledStatus,
    isDeleting,
    isUpdating,
    cancelScheduledStatus,
    updateScheduledTime,
  }
}
