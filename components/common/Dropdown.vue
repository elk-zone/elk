<script setup lang="ts">
const { modelValue } = defineModel<{
  modelValue: boolean
}>()

const el = ref<HTMLDivElement>()

onClickOutside(el, () => {
  modelValue.value = false
})
</script>

<template>
  <div ref="el" absolute bg-base>
    <slot />
  </div>
</template>
