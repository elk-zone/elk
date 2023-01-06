<script setup lang="ts">
import type { Card } from 'masto'

defineProps<{
  card: Card
  /** When it is root card in the list, not appear as a child card */
  root?: boolean
  /** For the preview image, only the small image mode is displayed */
  provider?: string
}>()
</script>

<template>
  <div
    px3 max-h-2xl
    flex flex-col
    :class="[
      root ? 'flex-gap-1 py1 sm:py3' : 'py1 justify-center sm:justify-start',
    ]"
    my-auto
  >
    <p text-secondary ws-pre-wrap break-all line-clamp-1>
      {{ provider }}
    </p>
    <strong
      v-if="card.title" font-normal sm:font-medium line-clamp-1
      break-all ws-pre-wrap
    >{{ card.title }}</strong>
    <p
      v-if="card.description"
      line-clamp-1 break-all sm:break-words text-secondary ws-pre-wrap :class="[root ? 'sm:line-clamp-2' : '']"
    >
      {{ card.description }}
    </p>
  </div>
</template>
