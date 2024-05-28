<script setup lang="ts">
import type { mastodon } from 'masto'

const props = withDefaults(defineProps<{
  attachment: mastodon.v1.MediaAttachment
  alt?: string
  removable?: boolean
  dialogLabelledBy?: string
}>(), {
  removable: true,
})

const emit = defineEmits<{
  (evt: 'remove'): void
  (evt: 'setDescription', description: string): void
}>()

// from https://github.com/mastodon/mastodon/blob/dfa984/app/models/media_attachment.rb#L40
const maxDescriptionLength = 1500

const isEditDialogOpen = ref(false)
const description = ref(props.attachment.description ?? '')

const generationInProgress = ref(false)

const userSettings = useUserSettings()

async function generateAltText() {
  // eslint-disable-next-line no-console
  console.log(JSON.parse(JSON.stringify(props)))

  const url = props.attachment.url

  if (!url)
    return

  if (generationInProgress.value)
    return

  const experimentalAltTextGeneration = getPreferences(userSettings.value, 'experimentalAltTextGeneration')

  if (!experimentalAltTextGeneration) {
    // TODO @Shinigami92 2024-05-28: Use a fancy dialog instead of the browser's alert
    // eslint-disable-next-line no-alert
    const allow = confirm('This will download a model with ~250MiB. Do you want to continue? This is an experimental feature and might fail in several scenarios.')

    if (!allow)
      return

    togglePreferences('experimentalAltTextGeneration')
  }

  generationInProgress.value = true

  try {
    const { pipeline, RawImage } = await import('@xenova/transformers')

    const pipe = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning')

    const imageElement = new Image()
    // See https://www.hacksoft.io/blog/handle-images-cors-error-in-chrome for why using `?request-with-cors`
    imageElement.crossOrigin = 'Anonymous'
    imageElement.src = `${url}?request-with-cors`

    const dataUrl = new Promise<string>((resolve) => {
      imageElement.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = imageElement.width
        canvas.height = imageElement.height

        const ctx = canvas.getContext('2d')!
        ctx.drawImage(imageElement, 0, 0)

        // TODO @Shinigami92 2024-05-28: Fix "Uncaught DOMException: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported."
        const dataUrl = canvas.toDataURL(`image/${url.split('.').pop()!}`)

        resolve(dataUrl)
      }
    })

    const img = await RawImage.fromURL(await dataUrl)

    const out = await pipe(img)

    // eslint-disable-next-line no-console
    console.debug(out)

    const firstOut = out?.[0]

    if (!firstOut || Array.isArray(firstOut))
      return

    description.value = firstOut.generated_text
  }
  catch (error) {
    console.error(error)
    // TODO @Shinigami92 2024-05-27: Display error message to the user, so they know that something went wrong
  }
  finally {
    generationInProgress.value = false
  }
}

function toggleApply() {
  isEditDialogOpen.value = false
  emit('setDescription', description.value)
}
</script>

<template>
  <div relative group>
    <StatusAttachment :attachment="attachment" w-full is-preview />
    <div absolute right-2 top-2>
      <div
        v-if="removable"
        :aria-label="$t('attachment.remove_label')"
        class="bg-black/75 hover:bg-red/75"
        text-white px2 py2 rounded-full cursor-pointer
        @click="$emit('remove')"
      >
        <div i-ri:close-line text-3 text-6 md:text-3 />
      </div>
    </div>
    <div absolute right-2 bottom-2>
      <button class="bg-black/75" text-white px2 py1 rounded-2 @click="isEditDialogOpen = true">
        {{ $t('action.edit') }}
      </button>
    </div>
    <ModalDialog
      v-model="isEditDialogOpen"
      :dialog-labelled-by="dialogLabelledBy"
      py-6
      px-6 max-w-300
    >
      <div flex flex-col-reverse gap-5 md:flex-row>
        <div flex flex-col gap-2 justify-between>
          <h1 id="edit-attachment" font-bold>
            {{ $t('attachment.edit_title') }}
          </h1>
          <div flex flex-col gap-2>
            <textarea v-model="description" p-3 h-50 bg-base rounded-2 border-strong border-1 md:w-100 />
            <div flex flex-row-reverse>
              <PublishCharacterCounter :length="description.length" :max="maxDescriptionLength" />
            </div>

            <!-- TODO @Shinigami92 2024-05-27: Style the button in the upper right corner of the textarea -->
            <button type="button" btn-outline flex="~ gap2 center" :disabled="generationInProgress" @click="generateAltText">
              <span block i-ri:sparkling-2-line />
              {{ $t('action.generate-alt-text') }}
              <span v-if="generationInProgress" aria-hidden="true" block animate-spin preserve-3d>
                <span block i-ri:loader-2-fill aria-hidden="true" />
              </span>
            </button>

            <button btn-outline :disabled="description.length > maxDescriptionLength" @click="toggleApply">
              {{ $t('action.apply') }}
            </button>
          </div>
          <button btn-outline @click="isEditDialogOpen = false">
            {{ $t('action.close') }}
          </button>
        </div>
        <StatusAttachment :attachment="attachment" w-full is-preview />
      </div>
    </ModalDialog>
  </div>
</template>
