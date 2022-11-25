<script setup lang="ts">
import type { Status } from 'masto'

const props = withDefaults(defineProps<{
  status: Status
  withAction?: boolean
}>(), {
  withAction: true,
})
const { translation } = useTranslation(props.status)
</script>

<template>
  <div class="status-body" whitespace-pre-wrap break-words :class="{ 'with-action': props.withAction }">
    <ContentRich
      :content="translation.visible ? translation.text : props.status.content"
      :emojis="props.status.emojis"
    />
  </div>
</template>

<style>
.status-body.with-action p {
  cursor: pointer;
}
</style>
