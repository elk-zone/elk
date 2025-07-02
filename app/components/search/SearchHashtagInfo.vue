<script setup lang="ts">
import type { mastodon } from 'masto'

const { hashtag } = defineProps<{
  hashtag: mastodon.v1.Tag
}>()

const totalTrend = computed(() =>
  hashtag.history?.reduce((total: number, item) => total + (Number(item.accounts) || 0), 0),
)
</script>

<template>
  <div flex flex-row items-center gap2 relative>
    <div w-10 h-10 flex-none rounded-full bg-active flex place-items-center place-content-center>
      <div i-ri:hashtag text-secondary text-lg />
    </div>
    <div flex flex-col>
      <span>
        {{ hashtag.name }}
      </span>
      <CommonTrending v-if="hashtag.history" :history="hashtag.history" text-xs text-secondary truncate />
    </div>
    <div v-if="totalTrend && hashtag.history" absolute left-15 right-0 top-0 bottom-4 op35 flex place-items-center place-content-center ml-auto>
      <CommonTrendingCharts
        :history="hashtag.history" :width="150" :height="20"
        text-xs text-secondary h-full w-full
      />
    </div>
  </div>
</template>
