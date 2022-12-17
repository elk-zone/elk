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
  <CommonInputImage
    ref="elInputImage"
    v-model="vmFile"
    :original="props.original"
    border="rounded-full"
    shadow="~"
    w="120px max-120px <sm:(80px max-80px)"
    h="120px <sm:80px"
  />
  <CommonCropImage v-model="vmFile" />
  <div />
</template>
