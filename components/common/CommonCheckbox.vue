<script setup lang="ts">
defineProps<{
  label: string
  hover?: boolean
}>()
const { modelValue } = defineModel<{
  modelValue?: boolean
}>()
</script>

<template>
  <label
    class="common-checkbox flex items-center cursor-pointer py-1 text-md w-full gap-y-1"
    :class="hover ? 'hover:bg-active ms--2 px-4 py-2' : null"
    @click.prevent="modelValue = !modelValue"
  >
    <span flex-1 ms-2 pointer-events-none>{{ label }}</span>
    <span
      :class="modelValue ? 'i-ri:checkbox-line' : 'i-ri:checkbox-blank-line'"
      text-lg
      aria-hidden="true"
    />
    <input
      v-model="modelValue"
      type="checkbox"
      sr-only
    >
  </label>
</template>

<style>
.common-checkbox:focus-within {
  outline: none;
  border-bottom: 1px solid var(--c-text-base);
}
</style>
