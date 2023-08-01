<script lang="ts" setup>
const emit = defineEmits<{
  (event: 'close'): void
}>()
const visible = defineModel<boolean>()

function close() {
  emit('close')
  visible.value = false
}
</script>

<template>
  <div
    flex="~ gap-2" justify-between items-center
    border="b base" text-sm text-secondary px4 py2 sm:py4
  >
    <div>
      <slot />
    </div>
    <button text-xl hover:text-primary bg-hover-overflow w="1.2em" h="1.2em" @click="close()">
      <div i-ri:close-line />
    </button>
  </div>
</template>
