<script setup lang="ts">
defineProps<{
  threadIndex: number
}>()

const threadLength = ref(1)
const threadingIsActive = ref(false)

function toggleThread() {
  threadingIsActive.value = !threadingIsActive.value
}
</script>

<template>
  <div flex flex-row rounded-3 bg-border>
    <div
      dir="ltr" pointer-events-none pe-1 pt-2 pl-2 text-sm tabular-nums text-secondary flex gap="0.5"
    >
      {{ threadIndex }}<span text-secondary-light>/</span><span text-secondary-light>{{ threadLength }}</span>
    </div>

    <button btn-action-icon :aria-label="$t('tooltip.manage_thread')" @click="toggleThread">
      <div v-if="threadingIsActive" i-ri:chat-delete-line />
      <div v-else i-ri:chat-new-line />
    </button>
  </div>
</template>
