<script setup lang="ts">
import type { UserLogin } from '~/types'

defineProps<{
  user: UserLogin
}>()
</script>

<template>
  <div flex="~ gap3" items-center>
    <div bg="gray/40" rounded-full w-54px h-54px flex shrink-0 items-center justify-center text-5>
      G
    </div>
    <div>
      Guest from <span font-bold>{{ user.server }}</span>
    </div>
  </div>
</template>
