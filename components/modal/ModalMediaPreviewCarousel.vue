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

const slideGap = 20
const doubleTapTreshold = 250

const view = ref()
const slider = ref()
const slide = ref()
const image = ref()

const reduceMotion = process.server ? ref(false) : useReducedMotion()
const isInitialScrollDone = useTimeout(350)
const canAnimate = computed(() => isInitialScrollDone.value && !reduceMotion.value)

const scale = ref(1)
const x = ref(0)
const y = ref(0)

const isDragging = ref(false)
const isPinching = ref(false)

const maxZoomOut = ref(1)
const isZoomedIn = computed(() => scale.value > 1)

function goToFocusedSlide() {
  scale.value = 1
  x.value = slide.value[modelValue.value].offsetLeft * scale.value
  y.value = 0
}

onMounted(() => {
  const slideGapAsScale = slideGap / view.value.clientWidth
  maxZoomOut.value = 1 - slideGapAsScale

  goToFocusedSlide()
})
watch(modelValue, goToFocusedSlide)

let lastGestureDistance = 0
useGesture({
  onPinch({ offset: [distance, _angle] }) {
    isPinching.value = true

    const currDistance = distance - lastGestureDistance
    lastGestureDistance = distance

    scale.value = Math.max(maxZoomOut.value, scale.value + currDistance / 200)
    restrictDragToInsideSlide()
  },
  onPinchEnd() {
    isPinching.value = false

    if (!isZoomedIn.value)
      goToFocusedSlide()
  },
  onDrag({ movement, delta, pinching, tap, first, last, swipe, event }) {
    event.preventDefault()

    if (first || pinching)
      return

    if (last)
      handleLastDrag(tap, swipe)
    else
      handleDrag(delta, movement)
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

  const scaledImageWidth = focusedImage.offsetWidth * scale.value
  const scaledHorizontalOverflow = scaledImageWidth / 2 - view.value.clientWidth / 2 + slideGap
  const horizontalOverflow = Math.max(0, scaledHorizontalOverflow / scale.value)

  const scaledImageHeight = focusedImage.offsetHeight * scale.value
  const scaledVerticalOverflow = scaledImageHeight / 2 - view.value.clientHeight / 2 + slideGap
  const verticalOverflow = Math.max(0, scaledVerticalOverflow / scale.value)

  return {
    left: focusedSlide.offsetLeft - horizontalOverflow,
    right: focusedSlide.offsetLeft + horizontalOverflow,
    top: focusedSlide.offsetTop - verticalOverflow,
    bottom: focusedSlide.offsetTop + verticalOverflow,
  }
})

function handleLastDrag(tap: boolean, swipe: [number, number]) {
  isDragging.value = false

  if (tap)
    handleTap()
  else if (swipe[0] || swipe[1])
    handleSwipe(swipe)
  else if (!isZoomedIn.value)
    slideToClosestSlide()
}

let lastTapAt = 0
function handleTap() {
  const now = Date.now()
  const isDoubleTap = now - lastTapAt < doubleTapTreshold
  lastTapAt = now

  if (!isDoubleTap)
    return

  if (isZoomedIn.value)
    goToFocusedSlide()
  else
    scale.value = 2
}

function handleSwipe([horiz, vert]: [number, number]) {
  if (isZoomedIn.value || isPinching.value)
    return

  if (horiz === 1) // left
    modelValue.value = Math.max(0, modelValue.value - 1)
  if (horiz === -1) // right
    modelValue.value = Math.min(media.length - 1, modelValue.value + 1)
  if (vert === -1) // top
    emit('close')

  goToFocusedSlide()
}

function slideToClosestSlide() {
  const startOfFocusedSlide = slide.value[modelValue.value].offsetLeft * scale.value
  const slideWidth = slide.value[modelValue.value].offsetWidth * scale.value

  if (x.value > startOfFocusedSlide + slideWidth / 2)
    modelValue.value = Math.min(media.length - 1, modelValue.value + 1)
  else if (x.value < startOfFocusedSlide - slideWidth / 2)
    modelValue.value = Math.max(0, modelValue.value - 1)

  goToFocusedSlide()
}

function handleDrag(delta: [number, number], movement: [number, number]) {
  isDragging.value = true

  if (isZoomedIn.value)
    handleZoomDrag(delta)
  else
    handleSlideDrag(movement)
}

function handleZoomDrag([deltaX, deltaY]: [number, number]) {
  x.value -= deltaX / scale.value
  y.value -= deltaY / scale.value

  restrictDragToInsideSlide()
}

function handleSlideDrag([movementX, movementY]: [number, number]) {
  goToFocusedSlide()

  if (-movementY > Math.abs(movementX)) // upwards movement is more then horizontal
    y.value -= movementY / scale.value
  else
    x.value -= movementX / scale.value

  y.value = Math.max(0, y.value)

  if (media.length === 1)
    x.value = 0
}

function restrictDragToInsideSlide() {
  x.value = Math.min(dragRestrictions.value.right, Math.max(dragRestrictions.value.left, x.value))
  y.value = Math.min(dragRestrictions.value.bottom, Math.max(dragRestrictions.value.top, y.value))
}

const sliderStyle = computed(() => {
  const style = {
    transform: `scale(${scale.value}) translate(${-x.value}px, ${-y.value}px)`,
    transition: 'none',
    gap: `${slideGap}px`,
  }

  if (canAnimate.value && !isDragging.value && !isPinching.value)
    style.transition = 'all 0.3s ease'

  return style
})
</script>

<template>
  <div ref="view" flex flex-row h-full w-full overflow-hidden>
    <div ref="slider" :style="sliderStyle" w-full h-full flex items-center>
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
          cursor-pointer
          :draggable="false"
          :src="item.url || item.previewUrl"
          :alt="item.description || ''"
        >
      </div>
    </div>
  </div>
</template>
