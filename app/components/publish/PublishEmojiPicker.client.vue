<script setup lang="ts">
import type { Picker } from 'emoji-mart'
import importEmojiLang from 'virtual:emoji-mart-lang-importer'

const emit = defineEmits<{
  (e: 'select', code: string): void
  (e: 'selectCustom', image: any): void
}>()

const { locale } = useI18n()

const el = ref<HTMLElement>()
const picker = ref<Picker>()
const colorMode = useColorMode()

async function openEmojiPicker() {
  await updateCustomEmojis()

  const theme = colorMode.value === 'dark' ? 'dark' : 'light'

  if (picker.value) {
    picker.value.update({
      theme,
      custom: customEmojisData.value,
    })
  }
  else {
    const [Picker, dataPromise, i18n] = await Promise.all([
      import('emoji-mart').then(({ Picker }) => Picker),
      import('@emoji-mart/data/sets/14/apple.json').then((r: any) => r.default).catch(() => {}),
      importEmojiLang(locale.value.split('-')[0]),
    ])

    picker.value = new Picker({
      data: () => dataPromise,
      onEmojiSelect({ native, src, alt, name }: any) {
        if (native)
          emit('select', native)
        else
          emit('selectCustom', { src, alt, 'data-emoji-id': name })
      },
      set: 'apple',
      theme,
      custom: customEmojisData.value,
      i18n,
      previewPosition: 'none',
      maxFrequentRows: 2,
      perLine: 8,
    })
  }
  await nextTick()
  const pickerEl = picker.value as unknown as HTMLElement
  // Omedia branding: accent + radius + font match the rest of Elk
  pickerEl.style.setProperty('--rgb-accent', 'var(--rgb-primary)')
  pickerEl.style.setProperty('--border-radius', '14px')
  pickerEl.style.setProperty('--category-icon-size', '18px')
  pickerEl.style.setProperty('--font-family', 'inherit')
  pickerEl.style.setProperty('--shadow', '0 8px 32px rgba(0, 0, 0, 0.12)')
  el.value?.appendChild(pickerEl)
}

function hideEmojiPicker() {
  if (picker.value)
    el.value?.removeChild(picker.value as any as HTMLElement)
}
</script>

<template>
  <CommonTooltip :content="$t('tooltip.add_emojis')">
    <VDropdown
      placement="top"
      strategy="fixed"
      :distance="6"
      popper-class="emoji-picker-popper"
      @apply-show="openEmojiPicker()"
      @apply-hide="hideEmojiPicker()"
    >
      <slot />

      <template #popper>
        <div ref="el" min-w-10 min-h-10 overflow-hidden />
      </template>
    </VDropdown>
  </CommonTooltip>
</template>

<style>
/* The emoji-mart picker has its own background, border-radius, and shadow.
   Strip the popper's chrome so the picker is the only visible surface. */
.emoji-picker-popper .v-popper__inner,
.emoji-picker-popper .v-popper__wrapper {
  overflow: visible !important;
  max-height: none !important;
  padding: 0 !important;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  border-radius: 0 !important;
}
.emoji-picker-popper .v-popper__inner > div {
  padding: 0 !important;
}
.emoji-picker-popper .v-popper__arrow-container {
  display: none !important;
}
</style>
