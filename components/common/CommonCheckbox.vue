<script setup lang="ts">
defineProps<{
  label?: string
  hover?: boolean
  iconChecked?: string
  iconUnchecked?: string
}>()
const modelValue = defineModel<boolean | null>()
</script>

<template>
  <label
    class="common-checkbox flex items-center cursor-pointer py-1 text-md w-full gap-y-1"
    :class="hover ? 'hover:bg-active ms--2 px-4 py-2' : null"
    v-bind="$attrs"
    @click.prevent="modelValue = !modelValue"
  >
    <span v-if="label" flex-1 ms-2 pointer-events-none>{{ label }}</span>
    <span
      :class="modelValue ? (iconChecked ?? 'i-ri:checkbox-line') : (iconUnchecked ?? 'i-ri:checkbox-blank-line')"
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
