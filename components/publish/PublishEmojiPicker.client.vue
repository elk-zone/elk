<script setup lang="ts">
import type { Picker } from 'emoji-mart'

const emit = defineEmits<{
  (e: 'select', code: string): void
}>()

const el = $ref<HTMLElement>()
let picker = $ref<Picker>()

async function openEmojiPicker() {
  if (!picker) {
    const { Picker } = await import('emoji-mart')
    picker = new Picker({
      data: () => import('@emoji-mart/data').then(r => r.default),
      onEmojiSelect(e: any) {
        emit('select', e.native)
      },
      theme: isDark.value ? 'dark' : 'light',
    })
    // TODO: custom picker
    el?.appendChild(picker as any as HTMLElement)
  }
}

watchEffect(() => {
  if (!picker)
    return
  picker.update({
    theme: isDark.value ? 'dark' : 'light',
  })
})
</script>

<template>
  <VDropdown
    @apply-show="openEmojiPicker()"
  >
    <button btn-action-icon :title="$t('tooltip.emoji')">
      <div i-ri:emotion-line />
    </button>
    <template #popper>
      <div ref="el" />
    </template>
  </VDropdown>
</template>
