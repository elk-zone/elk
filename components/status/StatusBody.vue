<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()
</script>

<template>
  <div class="status-body">
    <CommonRichContent :content="status.content" />
  </div>
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
