<script setup lang="ts">
const { scheduledStatuses, isLoading, error, fetchScheduledStatuses } = useScheduledStatuses()
const { t } = useI18n()

// Fetch scheduled statuses on mount
onMounted(() => {
  fetchScheduledStatuses()
})

// Handle cancel event from card
function handleCancel(id: string) {
  // The composable already updates the local state
  // We could show a toast notification here if needed
}

// Handle update event from card
function handleUpdate(id: string, scheduledAt: string) {
  // The composable already updates the local state
  // We could show a toast notification here if needed
}
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="isLoading" flex="~ col gap-4" p-4>
      <div v-for="i in 3" :key="i" animate-pulse>
        <div h-32 bg="gray-200 dark:gray-800" rounded-lg />
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" p-4 text-center text-red>
      <div i-ri:error-warning-line text-xl mb-2 />
      <p>{{ t('state.error') }}: {{ error }}</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="scheduledStatuses.length === 0" p-8 text-center text-secondary>
      <div i-ri:calendar-schedule-line text-4xl mb-4 />
      <p text-lg>
        {{ t('scheduled_status.no_scheduled_statuses') }}
      </p>
    </div>

    <!-- List of scheduled statuses -->
    <div v-else flex="~ col gap-4" p-4>
      <ScheduledStatusCard
        v-for="scheduledStatus in scheduledStatuses"
        :key="scheduledStatus.id"
        :scheduled-status="scheduledStatus"
        @cancel="handleCancel"
        @update="handleUpdate"
      />
    </div>
  </div>
</template>
