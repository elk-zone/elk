<script setup lang="ts">
const { modelValue } = defineModel<{
  modelValue: boolean
}>()

const el = ref<HTMLDivElement>()

onClickOutside(el, () => {
  if (modelValue)
    modelValue.value = false
})
</script>

<template>
  <div
    v-show="modelValue"
    ref="el"
    absolute
    bg-base
    rounded
    shadow-xl
    dark="border border-base"
  >
    <slot />
  </div>
</template>
