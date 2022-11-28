<script setup lang="ts">
import type { Status } from 'masto'

const { status, withAction = true } = defineProps<{
  status: Status
  withAction?: boolean
}>()
const { translation } = useTranslation(status)
</script>

<template>
  <div my2 class="status-body" whitespace-pre-wrap break-words :class="{ 'with-action': withAction }">
    <ContentRich
      v-if="status.content"
      :content="status.content"
      :emojis="status.emojis"
    />
    <div v-else h-3 />
    <template v-if="translation.visible">
      <div my2 h-px border="b base" bg-base />
      <ContentRich :content="translation.text" :emojis="status.emojis" />
    </template>
  </div>
</template>

<style>
.status-body.with-action p {
  cursor: pointer;
}
</style>
