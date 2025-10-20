<script setup lang="ts">
import type { mastodon } from 'masto'

const props = defineProps<{
  scheduledStatus: mastodon.v1.ScheduledStatus
}>()

const emit = defineEmits<{
  cancel: [id: string]
  update: [id: string, scheduledAt: string]
}>()

const { scheduledStatus, isDeleting, isUpdating, cancelScheduledStatus, updateScheduledTime } = useScheduledStatusActions({ scheduledStatus: toRef(() => props.scheduledStatus) })

const scheduledAt = useFormattedDateTime(props.scheduledStatus.scheduledAt)
const timeAgoOptions = useTimeAgoOptions(true)
const timeago = useTimeAgo(() => props.scheduledStatus.scheduledAt, timeAgoOptions)

const showEditDialog = ref(false)
const newScheduledTime = ref('')

async function handleCancel() {
  const result = await cancelScheduledStatus()
  if (result)
    emit('cancel', scheduledStatus.value.id)
}

async function handleUpdate() {
  if (!newScheduledTime.value)
    return

  const result = await updateScheduledTime(newScheduledTime.value)
  if (result) {
    showEditDialog.value = false
    emit('update', result.id, result.scheduledAt)
  }
}
</script>

<template>
  <article
    flex="~ col gap-2"
    border="~ base rounded-lg"
    p="4"
    bg="base"
  >
    <div flex="~ gap-2" items-center justify-between>
      <div flex="~ gap-2" items-center text-sm text-secondary>
        <div i-ri:calendar-schedule-line />
        <time :datetime="scheduledStatus.scheduledAt" :title="scheduledAt">
          {{ timeago }}
        </time>
      </div>
      <div flex="~ gap-2">
        <button
          btn-text
          text-sm
          :disabled="isUpdating"
          @click="showEditDialog = true"
        >
          <div i-ri:edit-line />
          {{ $t('action.edit') }}
        </button>
        <button
          btn-text
          text-sm
          text-red
          :disabled="isDeleting"
          @click="handleCancel"
        >
          <div i-ri:delete-bin-line />
          {{ $t('action.delete') }}
        </button>
      </div>
    </div>

    <div v-if="scheduledStatus.params.spoilerText" text-secondary>
      <strong>CW:</strong> {{ scheduledStatus.params.spoilerText }}
    </div>

    <div>
      {{ scheduledStatus.params.text || scheduledStatus.params.status }}
    </div>

    <div v-if="scheduledStatus.mediaAttachments && scheduledStatus.mediaAttachments.length > 0" flex="~ wrap gap-2">
      <div
        v-for="media in scheduledStatus.mediaAttachments"
        :key="media.id"
        class="media-preview"
      >
        <img v-if="media.previewUrl" :src="media.previewUrl" :alt="media.description || ''" w-20 h-20 object-cover rounded>
      </div>
    </div>

    <div v-if="scheduledStatus.params.visibility" flex="~ gap-2" items-center text-xs text-secondary>
      <div i-ri:earth-line v-if="scheduledStatus.params.visibility === 'public'" />
      <div i-ri:lock-unlock-line v-else-if="scheduledStatus.params.visibility === 'unlisted'" />
      <div i-ri:lock-line v-else-if="scheduledStatus.params.visibility === 'private'" />
      <div i-ri:mail-line v-else-if="scheduledStatus.params.visibility === 'direct'" />
      <span>{{ scheduledStatus.params.visibility }}</span>
    </div>

    <!-- Edit dialog -->
    <div v-if="showEditDialog" fixed inset-0 z-100 flex items-center justify-center bg-black:50>
      <div bg-base border="~ base rounded-lg" p-6 max-w-md w-full m-4>
        <h3 text-lg font-bold mb-4>
          {{ $t('scheduled_status.edit_time') }}
        </h3>
        <input
          v-model="newScheduledTime"
          type="datetime-local"
          w-full
          p-2
          border="~ base rounded"
          mb-4
        >
        <div flex="~ gap-2" justify-end>
          <button btn-text @click="showEditDialog = false">
            {{ $t('action.cancel') }}
          </button>
          <button btn-solid @click="handleUpdate" :disabled="!newScheduledTime || isUpdating">
            {{ $t('action.save') }}
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
