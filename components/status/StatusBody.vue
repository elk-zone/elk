<script setup lang="ts">
import type { Status } from 'masto'

const { status, withAction = true } = defineProps<{
  status: Status
  withAction?: boolean
}>()
const { translation } = useTranslation(status)
</script>

<template>
  <div class="status-body" whitespace-pre-wrap break-words :class="{ 'with-action': withAction }">
    <ContentRich
      v-if="status.content"
      class="line-compact"
      :content="status.content"
      :emojis="status.emojis"
      :lang="status.language"
    />
    <div v-else />
    <template v-if="translation.visible">
      <div my2 h-px border="b base" bg-base />
      <ContentRich class="line-compact" :content="translation.text" :emojis="status.emojis" />
    </template>
  </div>
</template>

<style>
.status-body.with-action p {
  cursor: pointer;
}
</style>
