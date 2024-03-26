<script setup lang="ts">
const threadingIsActive = ref(false)

function toggleThread() {
  threadingIsActive.value = !threadingIsActive.value
}
</script>

<template>
  <button
    btn-action-icon
    :aria-label="$t('tooltip.manage_thread')"
    @click="toggleThread"
  >
    <div i-system-uicons:thread :class="{ 'text-primary': threadingIsActive }" />
  </button>
</template>
