<script setup lang="ts">
import { useGesture } from '@vueuse/gesture'
import { useReducedMotion } from '@vueuse/motion'
import type { mastodon } from 'masto'

const { media = [], threshold = 70 } = defineProps<{
  media?: mastodon.v1.MediaAttachment[]
  threshold?: number
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

const animateTimeout = useTimeout(10)
const reduceMotion = process.server ? ref(false) : useReducedMotion()
const canAnimate = computed(() => !reduceMotion.value && animateTimeout.value)

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

useSwipe(view, {
  threshold,
  passive: false,
  onSwipeEnd(event, direction) {
    if (isZoomed.value || isPinching.value)
      return

    isDragging.value = false

    if (direction === 'right')
      modelValue.value = Math.max(0, modelValue.value - 1)
    if (direction === 'left')
      modelValue.value = Math.min(media.length - 1, modelValue.value + 1)
    if (direction === 'up')
      emit('close')
  },
})

function restrictToInsideSlide() {
  const focusedImage = image.value[modelValue.value]
  const focusedSlide = slide.value[modelValue.value]

  const gap = 20
  const scaledImageWidth = focusedImage.offsetWidth * scale.value
  const horizontalOverflow = (scaledImageWidth / 2 - view.value.clientWidth / 2 + gap) / scale.value
  const scaledImageHeight = focusedImage.offsetHeight * scale.value
  const verticalOverflow = (scaledImageHeight / 2 - view.value.clientHeight / 2 + gap) / scale.value

  const restrictions = {
    left: focusedSlide.offsetLeft - horizontalOverflow,
    right: focusedSlide.offsetLeft + horizontalOverflow,
    top: focusedSlide.offsetTop - verticalOverflow,
    bottom: focusedSlide.offsetTop + verticalOverflow,
  }

  x.value = Math.min(restrictions.right, Math.max(restrictions.left, x.value))
  y.value = Math.min(restrictions.bottom, Math.max(restrictions.top, y.value))
}

useGesture({
  onPinch({ offset: [distance, _angle] }) {
    isPinching.value = true

    scale.value = Math.max(1, 1 + distance / 200)
    // restrictToInsideSlide()
  },
  onPinchEnd() {
    isPinching.value = false

    if (!isZoomed.value)
      scrollToFocusedSlide()
  },
  onDrag({ delta: [deltaX, deltaY], pinching }) {
    isDragging.value = true

    if (pinching)
      return

    x.value -= deltaX / scale.value
    y.value -= deltaY / scale.value

    if (!isZoomed.value)
      y.value = Math.max(0, y.value)
    else
      restrictToInsideSlide()
  },
  onDragEnd() {
    isDragging.value = false

    if (!isZoomed.value)
      scrollToFocusedSlide()
  },
}, {
  domTarget: view,
  eventOptions: {
    passive: true,
  },
})

const sliderStyle = computed(() => {
  const style = {
    transform: `scale(${scale.value}) translate(${-x.value}px, ${-y.value}px)`,
    transition: 'none',
  }

  if (canAnimate.value && !isDragging.value)
    style.transition = 'all 0.5s ease'

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
