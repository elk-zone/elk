<script setup lang="ts">
import { useGesture } from '@vueuse/gesture'
import { useReducedMotion } from '@vueuse/motion'
import type { mastodon } from 'masto'

const { media = [] } = defineProps<{
  media?: mastodon.v1.MediaAttachment[]
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { modelValue } = defineModels<{
  modelValue: number
}>()

const view = ref()
const slider = ref()
const slide = ref()
const image = ref()

const reduceMotion = process.server ? ref(false) : useReducedMotion()

const scale = ref(1)
const x = ref(0)
const y = ref(0)

const isDragging = ref(false)
const isPinching = ref(false)

const isZoomed = computed(() => scale.value > 1)

function scrollToFocusedSlide() {
  scale.value = 1
  x.value = slide.value[modelValue.value].offsetLeft * scale.value
  y.value = 0
}

onMounted(() => scrollToFocusedSlide())
watch(modelValue, scrollToFocusedSlide)

let lastGestureDistance = 0
useGesture({
  onPinch({ offset: [distance, _angle] }) {
    isPinching.value = true

    const currDistance = distance - lastGestureDistance
    lastGestureDistance = distance

    scale.value = Math.max(1, scale.value + currDistance / 200)
    restrictDragToInsideSlide()
  },
  onPinchEnd() {
    isPinching.value = false

    if (!isZoomed.value)
      scrollToFocusedSlide()
  },
  onDrag({ delta, pinching, tap, first, swipe, event }) {
    event.preventDefault()

    if (first || pinching)
      return

    if (tap)
      handleTap()
    else if (swipe[0] || swipe[1])
      handleSwipe(swipe)
    else
      handleDrag(delta)
  },
  onDragEnd() {
    isDragging.value = false

    if (!isZoomed.value)
      scrollToFocusedSlide()
  },
}, {
  domTarget: view,
  eventOptions: {
    passive: false,
  },
})

const dragRestrictions = computed(() => {
  const focusedImage = image.value[modelValue.value]
  const focusedSlide = slide.value[modelValue.value]

  const gap = 20

  const scaledImageWidth = focusedImage.offsetWidth * scale.value
  const scaledHorizontalOverflow = scaledImageWidth / 2 - view.value.clientWidth / 2 + gap
  const horizontalOverflow = Math.max(0, scaledHorizontalOverflow / scale.value)

  const scaledImageHeight = focusedImage.offsetHeight * scale.value
  const scaledVerticalOverflow = scaledImageHeight / 2 - view.value.clientHeight / 2 + gap
  const verticalOverflow = Math.max(0, scaledVerticalOverflow / scale.value)

  return {
    left: focusedSlide.offsetLeft - horizontalOverflow,
    right: focusedSlide.offsetLeft + horizontalOverflow,
    top: focusedSlide.offsetTop - verticalOverflow,
    bottom: focusedSlide.offsetTop + verticalOverflow,
  }
})

let lastTapAt = 0
function handleTap() {
  const now = Date.now()
  const isDoubleTap = now - lastTapAt < 250
  lastTapAt = now
  if (!isDoubleTap)
    return

  if (isZoomed.value)
    scale.value = 1
  else
    scale.value = 1.5
}

function handleSwipe([horiz, vert]: [number, number]) {
  if (isZoomed.value || isPinching.value)
    return

  if (horiz === 1) // left
    modelValue.value = Math.max(0, modelValue.value - 1)
  if (horiz === -1) // right
    modelValue.value = Math.min(media.length - 1, modelValue.value + 1)
  if (vert === -1) // top
    emit('close')
}

function handleDrag([deltaX, deltaY]: [number, number]) {
  isDragging.value = true

  x.value -= deltaX / scale.value
  y.value -= deltaY / scale.value

  if (!isZoomed.value)
    y.value = Math.max(0, y.value)
  else
    restrictDragToInsideSlide()
}

function restrictDragToInsideSlide() {
  x.value = Math.min(dragRestrictions.value.right, Math.max(dragRestrictions.value.left, x.value))
  y.value = Math.min(dragRestrictions.value.bottom, Math.max(dragRestrictions.value.top, y.value))
}

const sliderStyle = computed(() => {
  const style = {
    transform: `scale(${scale.value}) translate(${-x.value}px, ${-y.value}px)`,
    transition: 'none',
  }

  if (!reduceMotion.value && !isDragging.value && !isPinching.value)
    style.transition = 'all 0.3s ease'

  return style
})
</script>

<template>
  <div ref="view" flex flex-row max-h-full max-w-full overflow-hidden>
    <div ref="slider" :style="sliderStyle" flex items-center gap="20px">
      <div
        v-for="item in media"
        :key="item.id"
        ref="slide"
        flex-shrink-0
        w-full
        h-full
        flex
        items-center
        justify-center
      >
        <img
          ref="image"
          select-none
          max-w-full
          max-h-full
          :draggable="false"
          :src="item.url || item.previewUrl"
          :alt="item.description || ''"
        >
      </div>
    </div>
  </div>
</template>
