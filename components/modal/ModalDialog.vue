<script setup lang='ts'>
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

type DialogType = 'top' | 'right' | 'bottom' | 'left' | 'dialog'

const {
  type = 'dialog',
} = defineProps<{
  type?: DialogType
}>()

const { modelValue } = defineModel<{
  modelValue: boolean
}>()

const positionClass = computed(() => {
  switch (type) {
    case 'dialog':
      return 'border rounded top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'
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
  switch (type) {
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

const target = ref<HTMLElement | null>(null)
const { activate, deactivate } = useFocusTrap(target)

watchEffect(() => {
  if (modelValue)
    activate()
  else
    deactivate()
})

let init = $ref(modelValue)
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
      ref="target" bg-base border-base absolute transition-all duration-200
      ease-out
      :class="positionClass"
      :style="modelValue ? {} : { transform }"
    >
      <slot v-if="init" />
    </div>
  </div>
</template>
