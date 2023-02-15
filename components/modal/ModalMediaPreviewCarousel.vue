<script setup lang="ts">
import { SwipeDirection } from '@vueuse/core'
import { useGesture } from '@vueuse/gesture'
import type { PermissiveMotionProperties } from '@vueuse/motion'
import { useReducedMotion } from '@vueuse/motion'
import type { mastodon } from 'masto'

const { media = [], threshold = 20 } = defineProps<{
  media?: mastodon.v1.MediaAttachment[]
  threshold?: number
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { modelValue } = defineModel<{
  modelValue: number
}>()

const target = ref()

const animateTimeout = useTimeout(10)
const reduceMotion = process.server ? ref(false) : useReducedMotion()

const canAnimate = computed(() => !reduceMotion.value && animateTimeout.value)

const { motionProperties } = useMotionProperties(target, {
  cursor: 'grab',
  scale: 1,
  x: 0,
  y: 0,
})
const { set } = useSpring(motionProperties as Partial<PermissiveMotionProperties>)

function resetZoom() {
  set({ scale: 1 })
}

watch(modelValue, resetZoom)

const { width, height } = useElementSize(target)
const { isSwiping, lengthX, lengthY, direction } = useSwipe(target, {
  threshold: 5,
  passive: false,
  onSwipeEnd(e, direction) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (direction === SwipeDirection.RIGHT && Math.abs(distanceX.value) > threshold) {
      modelValue.value = Math.max(0, modelValue.value - 1)
      resetZoom()
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (direction === SwipeDirection.LEFT && Math.abs(distanceX.value) > threshold) {
      modelValue.value = Math.min(media.length - 1, modelValue.value + 1)
      resetZoom()
    }

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (direction === SwipeDirection.UP && Math.abs(distanceY.value) > threshold)
      emit('close')
  },
})

useGesture({
  onPinch({ offset: [distance, angle] }) {
    set({ scale: 1 + distance / 200 })
  },
  onMove({ movement: [x, y], dragging, pinching }) {
    if (dragging && !pinching)
      set({ x, y })
  },
}, {
  domTarget: target,
  eventOptions: {
    passive: true,
  },
})

const distanceX = computed(() => {
  if (width.value === 0)
    return 0

  if (!isSwiping.value || (direction.value !== SwipeDirection.LEFT && direction.value !== SwipeDirection.RIGHT))
    return modelValue.value * 100 * -1

  return (lengthX.value / width.value) * 100 * -1 + (modelValue.value * 100) * -1
})

const distanceY = computed(() => {
  if (height.value === 0 || !isSwiping.value || direction.value !== SwipeDirection.UP)
    return 0

  return (lengthY.value / height.value) * 100 * -1
})
</script>

<template>
  <div ref="target" flex flex-row max-h-full max-w-full overflow-hidden>
    <div flex :style="{ transform: `translateX(${distanceX}%) translateY(${distanceY}%)`, transition: isSwiping ? 'none' : canAnimate ? 'all 0.5s ease' : 'none' }">
      <div v-for="item in media" :key="item.id" p4 select-none w-full flex-shrink-0 flex flex-col place-items-center>
        <img max-h-full max-w-full :draggable="false" select-none :src="item.url || item.previewUrl" :alt="item.description || ''">
      </div>
    </div>
  </div>
</template>
