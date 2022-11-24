<script setup lang='ts'>
const {
  direction = 'bottom',
} = defineProps<{
  direction?: string
}>()

const { modelValue } = defineModel<{
  modelValue: boolean
}>()

const positionClass = computed(() => {
  switch (direction) {
    case 'bottom':
      return 'bottom-0 left-0 right-0 border-t'
    case 'top':
      return 'top-0 left-0 right-0 border-b'
    case 'left':
      return 'bottom-0 left-0 top-0 border-r'
    case 'right':
      return 'bottom-0 top-0 right-0 border-l'
    default:
      return ''
  }
})

const transform = computed(() => {
  switch (direction) {
    case 'bottom':
      return 'translateY(100%)'
    case 'top':
      return 'translateY(-100%)'
    case 'left':
      return 'translateX(-100%)'
    case 'right':
      return 'translateX(100%)'
    default:
      return ''
  }
})

let init = $ref(false)
watchOnce(modelValue, () => {
  init = true
})
</script>

<template>
  <div
    fixed top-0 bottom-0 left-0 right-0 z-40
    :class="modelValue ? '' : 'pointer-events-none'"
  >
    <div
      bg-base bottom-0 left-0 right-0 top-0 absolute transition-opacity duration-500 ease-out
      :class="modelValue ? 'opacity-85' : 'opacity-0'"
      @click="modelValue = false"
    />
    <div
      bg-base border border-base absolute transition-all duration-200 ease-out
      :class="positionClass"
      :style="modelValue ? {} : { transform }"
    >
      <slot v-if="init" />
    </div>
  </div>
</template>
