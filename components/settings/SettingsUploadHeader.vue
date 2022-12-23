<script lang="ts" setup>
import type InputImage from '~/components/common/CommonInputImage.vue'

const props = defineProps<{
  modelValue?: File
  /** The user's avatar before change */
  original?: string
}>()
const emits = defineEmits<{
  (event: 'update:modelValue', value: File): void
}>()
const vmFile = useVModel(props, 'modelValue', emits, { passive: true })

const elInputImage = ref<InstanceType<typeof InputImage>>()

watch(vmFile, () => {
  elInputImage.value?.clearInput()
})
</script>

<template>
  <div rounded of-hidden bg="gray-500/20" aspect="3">
    <CommonInputImage
      ref="elInputImage"
      v-model="vmFile"
      :original="props.original"
      w-full h-full
    />
  </div>
  <CommonCropImage v-model="vmFile" :stencil-aspect-ratio="3 / 1" />
  <div />
</template>
