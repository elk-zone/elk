<script setup lang="ts">
defineProps<{
  label: string
}>()
const { modelValue } = defineModel<{
  modelValue: boolean
}>()
</script>

<template>
  <label class="flex items-center cursor-pointer" text-lg w-full @click.prevent="modelValue = !modelValue">
    <span
      :class="modelValue ? 'i-ri:checkbox-line' : 'i-ri:checkbox-blank-line'"
      aria-hidden="true"
    />
    <input
      v-model="modelValue"
      type="checkbox"
      sr-only
    >
    <span ml-2 pointer-events-none>{{ label }}</span>
  </label>
</template>
