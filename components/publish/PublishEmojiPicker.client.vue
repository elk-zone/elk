<script setup lang="ts">
import type { Picker } from 'emoji-mart'
import { updateCustomEmojis } from '~/composables/emojis'

const emit = defineEmits<{
  (e: 'select', code: string): void
  (e: 'selectCustom', image: any): void
}>()

const el = $ref<HTMLElement>()
let picker = $ref<Picker>()

async function openEmojiPicker() {
  await updateCustomEmojis()
  if (picker) {
    picker.update({
      theme: isDark.value ? 'dark' : 'light',
      custom: customEmojisData.value,
    })
  }
  else {
    const promise = import('@emoji-mart/data').then(r => r.default)
    const { Picker } = await import('emoji-mart')
    picker = new Picker({
      data: () => promise,
      onEmojiSelect({ native, src, alt, name }: any) {
        native
          ? emit('select', native)
          : emit('selectCustom', { src, alt, 'data-emoji-id': name })
      },
      theme: isDark.value ? 'dark' : 'light',
      custom: customEmojisData.value,
    })
  }
  await nextTick()
  // TODO: custom picker
  el?.appendChild(picker as any as HTMLElement)
}

const hideEmojiPicker = () => {
  if (picker)
    el?.removeChild(picker as any as HTMLElement)
}
</script>

<template>
  <VDropdown
    @apply-show="openEmojiPicker()"
    @apply-hide="hideEmojiPicker()"
  >
    <button btn-action-icon :title="$t('tooltip.emoji')">
      <div i-ri:emotion-line />
    </button>
    <template #popper>
      <div ref="el" min-w-10 min-h-10 />
    </template>
  </VDropdown>
</template>
