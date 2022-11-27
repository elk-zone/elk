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
  closeButton?: boolean
}>()

let isVisible = $ref(modelValue.value)
let isOut = $ref(!modelValue.value)

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

const transformClass = computed(() => {
  if (isOut) {
    switch (type) {
      case 'dialog':
        return 'op0'
      case 'bottom':
        return 'translate-y-[100%]'
      case 'top':
        return 'translate-y-[100%]'
      case 'left':
        return 'translate-x-[-100%]'
      case 'right':
        return 'translate-x-[100%]'
      default:
        return ''
    }
  }
})

const target = ref<HTMLElement | null>(null)
const { activate, deactivate } = useFocusTrap(target)

function close() {
  modelValue.value = false
}

watchEffect(() => {
  if (modelValue)
    activate()
  else
    deactivate()
})

useEventListener('keydown', (e: KeyboardEvent) => {
  if (!modelValue.value)
    return
  if (e.key === 'Escape') {
    close()
    e.preventDefault()
  }
})

watch(modelValue, async (v) => {
  if (v) {
    isOut = true
    isVisible = true
    setTimeout(() => {
      isOut = false
    }, 10)
  }
  else {
    isOut = true
  }
})

function onTransitionEnd() {
  if (!modelValue.value)
    isVisible = false
}
</script>

<template>
  <div
    v-if="isVisible"
    fixed top-0 bottom-0 left-0 right-0 z-40
    :class="modelValue ? '' : 'pointer-events-none'"
  >
    <div
      bg-base bottom-0 left-0 right-0 top-0 absolute transition-opacity duration-500 ease-out
      :class="isOut ? 'opacity-0' : 'opacity-85'"
      @click="close"
    />
    <div
      ref="target"
      bg-base border-base absolute transition-all duration-200 ease-out transform
      :class="`${positionClass} ${transformClass}`"
      @transitionend="onTransitionEnd"
    >
      <slot />
    </div>
  </div>
</template>
