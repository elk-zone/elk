<script setup lang="ts">
import importEmojiLang from 'virtual:emoji-mart-lang-importer'
import type { Picker } from 'emoji-mart'

const emit = defineEmits<{
  (e: 'select', code: string): void
  (e: 'selectCustom', image: any): void
}>()

const { locale } = useI18n()

const el = $ref<HTMLElement>()
let picker = $ref<Picker>()
const colorMode = useColorMode()

async function openEmojiPicker() {
  await updateCustomEmojis()

  if (picker) {
    picker.update({
      theme: colorMode.value,
      custom: customEmojisData.value,
    })
  }
  else {
    const { Picker } = await import('emoji-mart')

    picker = new Picker({
      data: () => import('@emoji-mart/data/sets/14/twitter.json').then((r: any) => r.default).catch(() => {}),
      onEmojiSelect({ native, src, alt, name }: any) {
        native
          ? emit('select', native)
          : emit('selectCustom', { src, alt, 'data-emoji-id': name })
      },
      set: 'twitter',
      theme: colorMode.value,
      custom: customEmojisData.value,
      i18n: () => importEmojiLang(locale.value.split('-')[0]),
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
  <CommonTooltip :content="$t('tooltip.add_emojis')">
    <VDropdown
      auto-boundary-max-size
      @apply-show="openEmojiPicker()"
      @apply-hide="hideEmojiPicker()"
    >
      <slot />

      <template #popper>
        <div ref="el" min-w-10 min-h-10 />
      </template>
    </VDropdown>
  </CommonTooltip>
</template>
