<script setup lang='ts'>
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

type DialogType = 'top' | 'right' | 'bottom' | 'left' | 'dialog'

const {
  type = 'dialog',
  closeButton = false,
} = defineProps<{
  type?: DialogType
  closeButton?: boolean
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
  <SafeTeleport to="#teleport-end">
    <div
      v-if="isVisible"
      class="scrollbar-hide"
      fixed top-0 bottom-0 left-0 right-0 z-10 overscroll-none overflow-y-scroll
      :class="modelValue ? '' : 'pointer-events-none'"
    >
      <!-- The style `scrollbar-hide overscroll-none overflow-y-scroll` and `h="[calc(100%+0.5px)]"` is used to implement scroll locking, -->
      <!-- corresponding to issue: #106, so please don't remove it. -->
      <div
        bg-base bottom-0 left-0 right-0 top-0 absolute transition-opacity duration-500 ease-out
        h="[calc(100%+0.5px)]"
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
      <button
        v-if="closeButton"
        btn-action-icon bg="black/20" aria-label="Close"
        hover:bg="black/40" dark:bg="white/10" dark:hover:bg="white/20"
        absolute top-0 right-0 m1
        @click="close"
      >
        <div i-ri:close-fill text-white />
      </button>
    </div>
  </SafeTeleport>
</template>

<style socped>
.scrollbar-hide {
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
