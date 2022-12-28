<script lang="ts" setup>
const props = withDefaults(defineProps<{
  modelValue?: File
  /** The image src before change */
  original?: string
  /** Allowed file types */
  allowedFileTypes?: string[]
  /** Allowed file size */
  allowedFileSize?: number

  imgClass?: string

  loading?: boolean
}>(), {
  allowedFileTypes: () => ['image/jpeg', 'image/png'],
  allowedFileSize: 1024 * 1024 * 5, // 5 MB
})
const emits = defineEmits<{
  (event: 'update:modelValue', value: File): void
  (event: 'error', code: number, message: string): void
}>()

const vmFile = useVModel(props, 'modelValue', emits, { passive: true })

const { t } = useI18n()

const elInput = ref<HTMLInputElement>()

function clearInput() {
  if (elInput.value)
    elInput.value.value = ''
}

function selectImage(e: Event) {
  const target = e.target as HTMLInputElement
  const image = target.files?.[0]
  if (!image) {
    vmFile.value = image
  }
  else if (!props.allowedFileTypes.includes(image.type)) {
    emits('error', 1, t('error.unsupported_file_format'))
    clearInput()
  }
  else if (image.size > props.allowedFileSize) {
    emits('error', 2, t('error.file_size_cannot_exceed_n_mb', [5]))
    clearInput()
  }
  else {
    vmFile.value = image
    clearInput()
  }
}

const defaultImage = computed(() => props.original || '')
/** Preview of selected images */
const previewImage = ref('')
/** The current images on display */
const imageSrc = computed<string>(() => previewImage.value || defaultImage.value)

// Update the preview image when the input file change
watch(vmFile, (image, _, onCleanup) => {
  let expired = false
  onCleanup(() => expired = true)

  if (image) {
    const reader = new FileReader()
    reader.readAsDataURL(image)
    reader.onload = (e) => {
      if (expired)
        return
      previewImage.value = e.target?.result as string
    }
  }
  else {
    previewImage.value = ''
    clearInput()
  }
})

defineExpose({
  clearInput,
})
</script>

<template>
  <label
    class="bg-slate-500/10 focus-within:(outline outline-primary)"
    relative
    flex justify-center items-center
    cursor-pointer
    of-hidden
  >
    <img
      v-if="imageSrc"
      :src="imageSrc"
      :class="imgClass || ''"
      object-cover
      w-full
      h-full
    >
    <div absolute bg="black/50" text-white rounded-full text-xl w12 h12 flex justify-center items-center hover="bg-black/40 text-primary">
      <div i-ri:upload-line />
    </div>

    <div
      v-if="loading"
      absolute inset-0
      bg="black/30" text-white
      flex justify-center items-center
    >
      <div class="i-ri:loader-4-line animate-spin animate-duration-[2.5s]" text-4xl />
    </div>
    <input
      ref="elInput"
      type="file"
      absolute opacity-0 inset-0 z--1
      :accept="allowedFileTypes.join(',')"
      @change="selectImage"
    >
  </label>
</template>
