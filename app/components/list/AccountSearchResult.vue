<script setup lang="ts">
import type { SearchResult } from '~/composables/masto/search'

defineProps<{
  result: SearchResult
  active: boolean
}>()
</script>

<template>
  <CommonScrollIntoView
    as="div"
    :active="active"
    py2 block px2
    :selected="active"
    :class="{ 'bg-active': active }"
  >
    <AccountInfo
      v-if="result.type === 'account'"
      :account="result.data"
    />
  </CommonScrollIntoView>
</template>
