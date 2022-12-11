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
<!--
  <label
    flex items-center place-content-center h-full flex-1 class="select-none"
    :class="modelValue ? '!text-primary' : ''"
    @click="modelValue = !modelValue"
  >
    <span v-show="checked" i-ri:close-fill />
    <span v-show="!checked" i-ri:more-fill />
    <input v-model="modelValue" type="checkbox" z="-1" absolute inset-0 opacity-0 :value="checked">
    {{ label }}
  </label>
-->
</template>
