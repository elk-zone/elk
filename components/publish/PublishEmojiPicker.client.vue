<script setup lang="ts">
import type { Picker } from 'emoji-mart'
import { updateCustomEmojis } from '~/composables/emojis'

const emit = defineEmits<{
  (e: 'select', code: string): void
}>()

const el = $ref<HTMLElement>()
let picker = $ref<Picker>()

async function openEmojiPicker() {
  if (!picker) {
    await updateCustomEmojis()
    const promise = import('@emoji-mart/data').then(r => r.default)
    const { Picker } = await import('emoji-mart')
    picker = new Picker({
      data: () => promise,
      onEmojiSelect(e: any) {
        emit('select', e.native || e.shortcodes)
      },
      theme: isDark.value ? 'dark' : 'light',
      custom: customEmojisData.value,
    })
  }
  await nextTick()
  // TODO: custom picker
  el?.appendChild(picker as any as HTMLElement)
}

const hidePicker = () => {
  if (picker)
    el?.removeChild(picker as any as HTMLElement)
}

watch(isDark, () => {
  picker?.update({
    theme: isDark.value ? 'dark' : 'light',
  })
})

watch(customEmojisData, () => {
  picker?.update({
    custom: customEmojisData.value,
  })
})
</script>

<template>
  <VDropdown
    @apply-show="openEmojiPicker()"
    @apply-hide="hidePicker()"
  >
    <button btn-action-icon :title="$t('tooltip.emoji')">
      <div i-ri:emotion-line />
    </button>
    <template #popper>
      <div ref="el" min-w-10 min-h-10 />
    </template>
  </VDropdown>
</template>
