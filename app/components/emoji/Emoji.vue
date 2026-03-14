<script setup lang="ts">
const { alt, dataEmojiId } = defineProps<{
  as: string
  alt?: string
  dataEmojiId?: string
}>()

const COLON_REGEX = /:/g
const UNDERSCORE_REGEX = /_/g

const title = ref<string | undefined>()

if (alt) {
  if (alt.startsWith(':')) {
    title.value = alt.replace(COLON_REGEX, '')
  }
  else {
    import('node-emoji').then(({ find }) => {
      title.value = find(alt)?.key.replace(UNDERSCORE_REGEX, ' ')
    })
  }
}

// if it has a data-emoji-id, use that as the title instead
if (dataEmojiId)
  title.value = dataEmojiId
</script>

<template>
  <component :is="as" v-bind="$attrs" :alt="alt" :data-emoji-id="dataEmojiId" :title="title">
    <slot />
  </component>
</template>
