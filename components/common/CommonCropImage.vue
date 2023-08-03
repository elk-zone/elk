<script lang="ts" setup>
import type { Boundaries } from 'vue-advanced-cropper'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

export interface Props {
  /** Crop frame aspect ratio (width/height), default 1/1 */
  stencilAspectRatio?: number
  /** The ratio of the longest edge of the cut box to the length of the cut screen, default 0.9, not more than 1 */
  stencilSizePercentage?: number
}
const props = withDefaults(defineProps<Props>(), {
  stencilAspectRatio: 1 / 1,
  stencilSizePercentage: 0.9,
})

const file = defineModel<File | null>()

const cropperDialog = ref(false)

const cropper = ref<InstanceType<typeof Cropper>>()

const cropperFlag = ref(false)

const cropperImage = reactive({
  src: '',
  type: 'image/jpg',
})

function stencilSize({ boundaries }: { boundaries: Boundaries }) {
  return {
    width: boundaries.width * props.stencilSizePercentage,
    height: boundaries.height * props.stencilSizePercentage,
  }
}

watch(file, (file, _, onCleanup) => {
  let expired = false
  onCleanup(() => expired = true)

  if (file && !cropperFlag.value) {
    cropperDialog.value = true
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      if (expired)
        return
      cropperImage.src = e.target?.result as string
      cropperImage.type = file.type
    }
  }
  cropperFlag.value = false
})

function cropImage() {
  if (cropper.value && file.value) {
    cropperFlag.value = true
    cropperDialog.value = false
    const { canvas } = cropper.value.getResult()
    canvas?.toBlob((blob) => {
      file.value = new File([blob as any], `cropped${file.value?.name}` as string, { type: blob?.type })
    }, cropperImage.type)
  }
}
</script>

<template>
  <ModalDialog v-model="cropperDialog" :use-v-if="false" max-w-500px flex>
    <div flex-1 w-0>
      <div text-lg text-center my2 px3>
        <h1>
          {{ $t('action.edit') }}
        </h1>
      </div>
      <div aspect-ratio-1>
        <Cropper
          ref="cropper"
          class="overflow-hidden w-full h-full"
          :src="cropperImage.src"
          :resize-image="{
            adjustStencil: false,
          }"
          :stencil-size="stencilSize"
          :stencil-props="{
            aspectRatio: props.stencilAspectRatio,
            movable: false,
            resizable: false,
            handlers: {},
          }"
          image-restriction="stencil"
        />
      </div>
      <div m-4>
        <button
          btn-solid w-full rounded text-sm
          @click="cropImage()"
        >
          {{ $t('action.confirm') }}
        </button>
      </div>
    </div>
  </ModalDialog>
</template>
