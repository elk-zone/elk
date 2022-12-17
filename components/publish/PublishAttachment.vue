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

defineEmits<{
  (evt: 'remove'): void
  (evt: 'setDescription', description: string): void
}>()

const isEditDialogOpen = ref(false)
const description = ref(props.attachment.description ?? '')
</script>

<template>
  <div relative group>
    <StatusAttachment :attachment="attachment" w-full />
    <div absolute right-2 top-2>
      <div
        v-if="removable"
        aria-label="Remove attachment"
        hover:bg="gray/40" transition-100 p-1 rounded-5 cursor-pointer
        :class="[isSmallScreen ? '' : 'op-0 group-hover:op-100hover:']"
        mix-blend-difference
        @click="$emit('remove')"
      >
        <div i-ri:close-line text-3 :class="[isSmallScreen ? 'text-6' : 'text-3']" />
      </div>
    </div>
    <div absolute right-2 bottom-2>
      <button class="bg-black/75" text-white px2 py1 rounded-2 @click="isEditDialogOpen = true">
        Edit
      </button>
    </div>
    <ModalDialog
      v-model="isEditDialogOpen"
      :dialog-labelled-by="dialogLabelledBy"
      py-6
      px-6 max-w-300
    >
      <div flex gap-5>
        <div flex flex-col gap-2 justify-between>
          <h1 id="edit-attachment" font-bold>
            Description
          </h1>
          <div flex flex-col gap-2>
            <textarea v-model="description" p-3 w-100 h-50 bg-base rounded-2 border-strong border-1 />
            <button btn-outline @click="$emit('setDescription', description)">
              Apply
            </button>
          </div>
          <button btn-outline @click="isEditDialogOpen = false">
            Close
          </button>
        </div>
        <StatusAttachment :attachment="attachment" w-full />
      </div>
    </ModalDialog>
  </div>
</template>
