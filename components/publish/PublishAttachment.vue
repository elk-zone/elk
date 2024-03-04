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
