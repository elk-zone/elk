<script setup lang="ts">
defineProps<{
  label: string
  value: any
  hover?: boolean
}>()
const { modelValue } = defineModel<{
  modelValue: any
}>()
</script>

<template>
  <label
    class="common-radio flex items-center cursor-pointer py-1 text-md w-full gap-y-1"
    :class="hover ? 'hover:bg-active ml--2 pl-4' : null"
    @click.prevent="modelValue = value"
  >
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
    <span ml-2 pointer-events-none>{{ label }}</span>
  </label>
</template>

<style>
.common-radio:focus-within {
  outline: none;
  border-bottom: 1px solid var(--c-text-base);
}
</style>
