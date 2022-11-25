<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()
const { translation } = useTranslation(status)
</script>

<template>
  <div class="status-body" whitespace-pre-wrap break-words>
    <ContentRichSetup :content="translation.visible ? translation.text : status.content" :emojis="status.emojis" />
  </div>
</template>
