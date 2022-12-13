<script setup lang="ts">
import type { SearchResult } from './types'
const props = defineProps<{ result: SearchResult; active: boolean }>()

const el = ref<HTMLElement>()
watch(() => props.active, (active) => {
  const _el = unrefElement(el)

  if (active && _el)
    _el.scrollIntoView({ block: 'nearest', inline: 'start' })
})

const onActivate = () => {
  (document.activeElement as HTMLElement).blur()
}
</script>

<template>
  <RouterLink ref="el" :to="result.to" py2 block px2 :aria-selected="active" :class="{ 'bg-active': active }" hover:bg-active @click="() => onActivate()">
    <SearchHashtagInfo v-if="result.type === 'hashtag'" :hashtag="result.hashtag" />
    <AccountInfo v-else-if="result.type === 'account'" :account="result.account" />
    <div v-else-if="result.type === 'action'" text-center>
      {{ result.action!.label }}
    </div>
  </RouterLink>
</template>
