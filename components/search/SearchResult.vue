<script setup lang="ts">
import type { SearchResult } from '~/composables/masto/search'

defineProps<{
  result: SearchResult
  active: boolean
}>()

function onActivate() {
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
    <SearchHashtagInfo v-if="result.type === 'hashtag'" :hashtag="result.data" />
    <SearchAccountInfo v-else-if="result.type === 'account'" :account="result.data" />
    <StatusCard v-else-if="result.type === 'status'" :status="result.data" :actions="false" :show-reply-to="false" />
    <!-- <div v-else-if="result.type === 'action'" text-center>
      {{ result.action!.label }}
    </div> -->
  </CommonScrollIntoView>
</template>
