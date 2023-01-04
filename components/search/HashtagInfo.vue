<script setup lang="ts">
import type { History, Tag } from 'masto'

const { hashtag } = defineProps<{ hashtag: Tag }>()

const totalTrend = $computed(() =>
  hashtag.history?.reduce((total: number, item) => total + (Number(item.accounts) || 0), 0),
)
</script>

<template>
  <div flex flex-row items-center gap2>
    <div w-12 h-12 rounded-full bg-active flex place-items-center place-content-center>
      <div i-ri:hashtag text-secondary text-lg />
    </div>
    <div flex flex-col>
      <span>
        {{ hashtag.name }}
      </span>
      <CommonTrending :history="hashtag.history" text-xs text-secondary truncate />
    </div>
    <div v-if="totalTrend" w-12 h-12 flex place-items-center place-content-center ml-auto>
      <CommonTrendingCharts :history="hashtag.history" text-xs text-secondary />
    </div>
  </div>
</template>
