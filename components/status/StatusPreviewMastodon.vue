<script setup lang="ts">
import type { Card } from 'masto'

defineProps<{
  card: Card
}>()

/**
 *  TODO:
 * - extract username
 * - generate user profile link
 * - quotation icon ?
*/
</script>

<template>
  <div
    v-if="card.image"
    flex flex-col
    display-block of-hidden
    bg-code
    relative
    border="base"
    w-full min-h-50 md:min-h-60 border-b
    justify-center
    rounded-lg
  >
    <div p4 sm:px-8 flex flex-col justify-between min-h-50 md:min-h-60 h-full>
      <div flex justify-between items-center gap-2 sm:gap-6 h-full mb-2 min-h-35 md:min-h-45>
        <div flex flex-col gap-2>
          <a flex gap-1 text-sm flex-wrap leading-none :href="card.url" target="_blank">
            <span>{{ card.title }}</span>
          </a>
          <a sm:text-lg :href="card.url" target="_blank">
            <span text-secondary leading-tight>{{ card.description }}</span>
          </a>
        </div>
        <div>
          <a :href="card.url" target="_blank">
            <img w-30 aspect-square width="20" height="20" rounded-2 :src="card.image">
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
