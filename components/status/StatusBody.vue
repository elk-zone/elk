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
      :content="translation.visible ? translation.text : status.content"
      :emojis="status.emojis"
    />
  </div>
</template>

<style>
.status-body.with-action p {
  cursor: pointer;
}
</style>
