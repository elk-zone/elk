<script setup lang="ts">
import type { SearchResult } from './types'

defineProps<{
  result: SearchResult
  active: boolean
}>()

const onActivate = () => {
  (document.activeElement as HTMLElement).blur()
}
</script>

<template>
  <CommonScrollIntoView
    as="RouterLink"
    hover:bg-active
    :active="active"
    :to="result.to" py2 block px2
    :aria-selected="active"
    :class="{ 'bg-active': active }"
    @click="() => onActivate()"
  >
    <SearchHashtagInfo v-if="result.type === 'hashtag'" :hashtag="result.hashtag" />
    <SearchAccountInfo v-else-if="result.type === 'account' && result.account" :account="result.account" />
    <StatusCard v-else-if="result.type === 'status' && result.status" :status="result.status" :actions="false" :show-reply-to="false" />
    <!-- <div v-else-if="result.type === 'action'" text-center>
      {{ result.action!.label }}
    </div> -->
  </CommonScrollIntoView>
</template>
