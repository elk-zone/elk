<script setup lang="ts">
import type { Picker } from 'emoji-mart'
import type { ComputedRef } from 'vue'
import type { LocaleObject } from '#i18n'

const emit = defineEmits<{
  (e: 'select', code: string): void
  (e: 'selectCustom', image: any): void
}>()

const { locale } = useI18n()
const { locales } = useI18n() as { locales: ComputedRef<LocaleObject[]> }

const el = $ref<HTMLElement>()
let picker = $ref<Picker>()
const colorMode = useColorMode()
const emojiMartLocale = ref<string>('en.json')

watchEffect(() => {
  const emojiPickerLocale = locales.value.find(l => l.code === locale.value) as LocaleObject
  emojiMartLocale.value = emojiPickerLocale?.files[0] || 'en.json'
})

async function openEmojiPicker() {
  await updateCustomEmojis()

  if (picker) {
    picker.update({
      theme: colorMode.value,
      custom: customEmojisData.value,
    })
  }
  else {
    const promise = import('@emoji-mart/data/sets/14/twitter.json').then(r => r.default)
    const i18n = import(`@emoji-mart/data/i18n/${emojiMartLocale.value}`).then(r => r.default)
    const { Picker } = await import('emoji-mart')

    picker = new Picker({
      data: () => promise,
      onEmojiSelect({ native, src, alt, name }: any) {
        native
          ? emit('select', native)
          : emit('selectCustom', { src, alt, 'data-emoji-id': name })
      },
      set: 'twitter',
      theme: colorMode.value,
      custom: customEmojisData.value,
      i18n,
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
