<script setup lang="ts">
defineProps<{
  label: string
  value: any
  hover?: boolean
}>()
const modelValue = defineModel()
</script>

<template>
  <label
    class="common-radio flex items-center cursor-pointer py-1 text-md w-full gap-y-1"
    :class="hover ? 'hover:bg-active ms--2 px-4 py-2' : null"
    @click.prevent="modelValue = value"
  >
    <span flex-1 ms-2 pointer-events-none>{{ label }}</span>
    <span
      :class="modelValue === value ? 'i-ri:radio-button-line' : 'i-ri:checkbox-blank-circle-line'"
      aria-hidden="true"
    />
    <input
      v-model="modelValue"
      type="radio"
      :value="value"
      sr-only
    >
  </label>
</template>

<style>
.common-radio:focus-within {
  outline: none;
  border-bottom: 1px solid var(--c-text-base);
}
</style>
