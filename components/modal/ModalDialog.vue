<script setup lang='ts'>
const { modelValue } = defineModel<{
  modelValue: boolean
}>()

let init = $ref(modelValue || false)
watchOnce(modelValue, () => {
  init = true
})
</script>

<template>
  <div
    class="fixed top-0 bottom-0 left-0 right-0 z-60"
    :class="modelValue ? '' : 'pointer-events-none'"
  >
    <div
      class="
        bg-base bottom-0 left-0 right-0 top-0 absolute transition-opacity duration-500 ease-out
      "
      :class="modelValue ? 'opacity-85' : 'opacity-0'"
      @click="modelValue = false"
    />
    <div
      class="
        bg-base absolute transition-all duration-200 ease-out shadow rounded-md transform
        border border-base left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
      "
      :class="modelValue ? 'opacity-100' : 'opacity-0'"
    >
      <slot v-if="init" />
    </div>
  </div>
</template>
