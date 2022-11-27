<script setup lang="ts">
import type { Status } from 'masto'

const { status, withAction = true } = defineProps<{
  status: Status
  withAction?: boolean
}>()
const { translation } = useTranslation(status)
const content = $computed(() => translation.visible ? translation.text : status.content)
</script>

<template>
  <div class="status-body" whitespace-pre-wrap break-words :class="{ 'with-action': withAction }">
    <ContentRich
      v-if="content"
      :content="content"
      :emojis="status.emojis"
    />
    <div v-else h-3 />
  </div>
</template>

<style>
.status-body.with-action p {
  cursor: pointer;
}
</style>
