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

<style lang="postcss">
.status-body {
  a {
    --at-apply: text-primary hover:underline;
    .invisible {
      --at-apply: hidden;
    }
    .ellipsis {
      --at-apply: truncate overflow-hidden ws-nowrap;
    }
  }
  b {
    --at-apply: font-bold;
  }
  p {
    --at-apply: my-2;
  }
}
</style>
