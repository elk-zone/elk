<script setup lang="ts">
import type { mastodon } from 'masto'

defineProps<{
  card: mastodon.v1.PreviewCard
  /** When it is root card in the list, not appear as a child card */
  root?: boolean
  /** For the preview image, only the small image mode is displayed */
  provider?: string
}>()
</script>

<template>
  <div
    max-h-2xl
    flex flex-col
    my-auto
    :class="[
      root ? 'flex-gap-1' : 'justify-center sm:justify-start',
    ]"
  >
    <p text-secondary break-all line-clamp-1>
      {{ provider }}
    </p>
    <strong
      v-if="card.title" font-normal sm:font-medium line-clamp-1
      break-all
    >{{ card.title }}</strong>
    <p
      v-if="card.description"
      line-clamp-1 break-all sm:break-words text-secondary :class="[root ? 'sm:line-clamp-2' : '']"
    >
      {{ card.description }}
    </p>
  </div>
</template>
