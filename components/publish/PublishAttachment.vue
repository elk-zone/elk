<script setup lang="ts">
import type { Attachment } from 'masto'

const props = withDefaults(defineProps<{
  attachment: Attachment
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

const isEditDialogOpen = ref(false)
const description = ref(props.attachment.description ?? '')
const toggleApply = () => {
  isEditDialogOpen.value = false
  emit('setDescription', unref(description))
}
</script>

<template>
  <div relative group>
    <StatusAttachment :attachment="attachment" w-full />
    <div absolute right-2 top-2>
      <div
        v-if="removable"
        :aria-label="$t('attachment.remove_label')"
        hover:bg="gray/40" transition-100 p-1 rounded-5 cursor-pointer
        :class="[isHydrated.value && isSmallScreen ? '' : 'op-0 group-hover:op-100hover:']"
        mix-blend-difference
        @click="$emit('remove')"
      >
        <div i-ri:close-line text-3 :class="[isHydrated.value && isSmallScreen ? 'text-6' : 'text-3']" />
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
            <button btn-outline @click="toggleApply">
              {{ $t('action.apply') }}
            </button>
          </div>
          <button btn-outline @click="isEditDialogOpen = false">
            {{ $t('action.close') }}
          </button>
        </div>
        <StatusAttachment :attachment="attachment" w-full />
      </div>
    </ModalDialog>
  </div>
</template>
