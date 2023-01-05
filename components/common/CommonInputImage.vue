<script lang="ts" setup>
import { fileOpen } from 'browser-fs-access'
import type { FileWithHandle } from 'browser-fs-access'

const props = withDefaults(defineProps<{
  modelValue?: FileWithHandle | null
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
const emit = defineEmits<{
  (event: 'update:modelValue', value: FileWithHandle): void
  (event: 'pick', value: FileWithHandle): void
  (event: 'error', code: number, message: string): void
}>()

const file = useVModel(props, 'modelValue', emit, { passive: true })

const { t } = useI18n()

const defaultImage = computed(() => props.original || '')
/** Preview of selected images */
const previewImage = ref('')
/** The current images on display */
const imageSrc = computed<string>(() => previewImage.value || defaultImage.value)

const pickImage = async () => {
  const image = await fileOpen({
    description: 'Image',
    mimeTypes: props.allowedFileTypes,
  })

  if (!props.allowedFileTypes.includes(image.type)) {
    emit('error', 1, t('error.unsupported_file_format'))
    return
  }
  else if (image.size > props.allowedFileSize) {
    emit('error', 2, t('error.file_size_cannot_exceed_n_mb', [5]))
    return
  }

  file.value = image
  emit('pick', file.value)
}

watch(file, (image, _, onCleanup) => {
  let expired = false
  onCleanup(() => expired = true)

  if (!image) {
    previewImage.value = ''
    return
  }
  const reader = new FileReader()
  reader.readAsDataURL(image)
  reader.onload = (evt) => {
    if (expired)
      return
    previewImage.value = evt.target?.result as string
  }
})
</script>

<template>
  <label
    class="bg-slate-500/10 focus-within:(outline outline-primary)"
    relative
    flex justify-center items-center
    cursor-pointer
    of-hidden
    @click="pickImage"
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
  </label>
</template>
