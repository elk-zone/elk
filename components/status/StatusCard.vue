<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()
const el = ref<HTMLElement>()

const router = useRouter()
function go(e: MouseEvent) {
  if (e.target === el.value)
    router.push(`/@${status.account.acct}/${status.id}`)
}
</script>

<template>
  <div ref="el" flex flex-col gap-2 my-4 @click="go">
    <AccountInfo :account="status.account" />
    <StatusBody :status="status" />
    <StatusActions :status="status" />
  </div>
</template>
