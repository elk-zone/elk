<script setup lang="ts">
import type { Status } from 'masto'

defineProps<{
  status: Status
}>()

// TODO: parse and interop content (link, emojis)
</script>

<template>
  <div class="status-body" v-html="sanitize(status.content)" />
</template>

<style>
.status-body a {
  --at-apply: text-primary hover:underline;
}
.status-body b {
  --at-apply: font-bold;
}
.status-body p {
  --at-apply: my-1;
}
.status-body a .invisible {
  --at-apply: hidden;
}
.status-body a .ellipsis {
  --at-apply: truncate overflow-hidden ws-nowrap;
}
</style>
