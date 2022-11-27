<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
  inline: boolean
}>()

const editedAt = computed(() => status.editedAt)
const formatted = useFormattedDateTime(editedAt)
</script>

<template>
  <template v-if="editedAt">
    <CommonTooltip v-if="inline" :content="`Edited ${formatted}`">
      <time
        :title="editedAt"
        :datetime="editedAt"
        font-bold underline decoration-dashed
        text-secondary
      >&nbsp;*</time>
    </CommonTooltip>

    <CommonDropdown v-else>
      <slot />

      <template #popper>
        <div text-sm p2>
          <div text-center mb1>
            Edited {{ formatted }}
          </div>
          <StatusEditHistory :status="status" />
        </div>
      </template>
    </CommonDropdown>
  </template>
</template>
