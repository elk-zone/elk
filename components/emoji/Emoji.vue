<script setup lang="ts">
const { as, alt, dataEmojiId } = $defineProps<{
  as: string
  alt?: string
  dataEmojiId?: string
}>()

let title = $ref<string | undefined>()

if (alt) {
  if (alt.startsWith(':')) {
    title = alt.replace(/:/g, '')
  }
  else {
    import('node-emoji').then(({ find }) => {
      title = find(alt)?.key.replace(/_/g, ' ')
    })
  }
}

// if it has a data-emoji-id, use that as the title instead
if (dataEmojiId)
  title = dataEmojiId
</script>

<template>
  <component :is="as" v-bind="$attrs" :alt="alt" :data-emoji-id="dataEmojiId" :title="title">
    <slot />
  </component>
</template>
