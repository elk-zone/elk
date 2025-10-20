<script setup lang="ts">
const scheduledAt = defineModel<string | undefined>()
const { t } = useI18n()

const showScheduleDialog = ref(false)
const tempScheduledTime = ref('')

// Format the scheduled time for display
const scheduledAtDisplay = computed(() => {
  if (!scheduledAt.value)
    return null

  const date = new Date(scheduledAt.value)
  return useFormattedDateTime(date)
})

function openDialog() {
  // Initialize with current scheduled time or empty
  if (scheduledAt.value) {
    // Convert ISO string to datetime-local format
    const date = new Date(scheduledAt.value)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    tempScheduledTime.value = `${year}-${month}-${day}T${hours}:${minutes}`
  }
  else {
    tempScheduledTime.value = ''
  }
  showScheduleDialog.value = true
}

function applySchedule() {
  if (tempScheduledTime.value) {
    // Convert datetime-local to ISO string
    scheduledAt.value = new Date(tempScheduledTime.value).toISOString()
  }
  showScheduleDialog.value = false
}

function clearSchedule() {
  scheduledAt.value = undefined
  tempScheduledTime.value = ''
  showScheduleDialog.value = false
}

// Get minimum datetime (now)
const minDateTime = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
})
</script>

<template>
  <div>
    <CommonTooltip placement="top" :content="scheduledAt ? $t('scheduled_status.scheduled_at', [scheduledAtDisplay]) : $t('scheduled_status.schedule')">
      <button
        btn-action-icon
        :aria-label="$t('scheduled_status.schedule')"
        :class="{ 'text-primary': scheduledAt }"
        @click="openDialog"
      >
        <div :class="scheduledAt ? 'i-ri:calendar-check-fill' : 'i-ri:calendar-schedule-line'" />
      </button>
    </CommonTooltip>

    <!-- Schedule dialog -->
    <div v-if="showScheduleDialog" fixed inset-0 z-100 flex items-center justify-center bg-black:50 @click.self="showScheduleDialog = false">
      <div bg-base border="~ base rounded-lg" p-6 max-w-md w-full m-4>
        <h3 text-lg font-bold mb-4>
          {{ $t('scheduled_status.schedule') }}
        </h3>
        <div mb-4>
          <label block text-sm mb-2>
            {{ $t('scheduled_status.scheduled_to_publish') }}
          </label>
          <input
            v-model="tempScheduledTime"
            type="datetime-local"
            :min="minDateTime"
            w-full
            p-2
            border="~ base rounded"
            bg-base
          >
        </div>
        <div flex="~ gap-2" justify-end>
          <button
            v-if="scheduledAt"
            btn-text
            @click="clearSchedule"
          >
            {{ $t('action.clear') }}
          </button>
          <button btn-text @click="showScheduleDialog = false">
            {{ $t('action.cancel') }}
          </button>
          <button btn-solid @click="applySchedule" :disabled="!tempScheduledTime">
            {{ $t('action.apply') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
