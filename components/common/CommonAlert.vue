<script lang="ts" setup>
const props = withDefaults(defineProps<{
  modelValue?: boolean
}>(), {
  modelValue: true,
})
const emits = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (event: 'close'): void
}>()
const visible = useVModel(props, 'modelValue', emits, { passive: true })

function close() {
  emits('close')
  visible.value = false
}
</script>

<template>
  <div
    flex="~ gap-2" justify-between items-center
    class="border-b border-base text-sm text-secondary px4 py2 sm:py4"
  >
    <div>
      <slot />
    </div>
    <button text-xl hover:text-primary bg-hover-overflow w-1.4em h-1.4em @click="close()">
      <div i-ri:close-line />
    </button>
  </div>
</template>
