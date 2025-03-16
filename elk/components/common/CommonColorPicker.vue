<script setup lang="tsx">
const { required, name, ...props } = defineProps<{
  required?: boolean
  name?: string
}>()
const model = defineModel<string>()
</script>

<template>
  <div flex gap-2>
    <div w-10 :style="{ background: model }" rounded-lg input-base />
    <input
      v-bind="props"
      v-model="model"
      :name="name"
      :required="required"
      pattern="#[0-9A-Fa-f]{6}"
      type="text"
      placeholder-text-secondary
      input-base
      w-auto
    >
  </div>
</template>
