<script setup lang="ts">
import type { SearchResult } from './types'
defineProps<{ result: SearchResult; active: boolean }>()

const onActivate = () => {
  (document.activeElement as HTMLElement).blur()
}
</script>

<template>
  <CommonScrollIntoView as="RouterLink" :active="active" :to="result.to" py2 block px2 :aria-selected="active" :class="{ 'bg-active': active }" hover:bg-active @click="() => onActivate()">
    <SearchHashtagInfo v-if="result.type === 'hashtag'" :hashtag="result.hashtag" />
    <AccountInfo v-else-if="result.type === 'account'" :account="result.account" />
    <div v-else-if="result.type === 'action'" text-center>
      {{ result.action!.label }}
    </div>
  </CommonScrollIntoView>
</template>
