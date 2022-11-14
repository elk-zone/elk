<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()
const el = ref<HTMLElement>()

const router = useRouter()

function go(e: MouseEvent) {
  const path = e.composedPath() as HTMLElement[]
  const hasButton = path.find(el => el.tagName === 'A' || el.tagName === 'BUTTON')
  if (hasButton)
    return

  if (path.find(i => i === el.value))
    router.push(`/@${status.account.acct}/${status.id}`)
}

const timeago = useTimeAgo(() => status.createdAt, {
  showSecond: true,
  messages: {
    justNow: 'just now',
    past: n => n,
    future: n => n.match(/\d/) ? `in ${n}` : n,
    month: (n, past) => n === 1
      ? past
        ? 'last month'
        : 'next month'
      : `${n}m`,
    year: (n, past) => n === 1
      ? past
        ? 'last year'
        : 'next year'
      : `${n}y`,
    day: (n, past) => n === 1
      ? past
        ? 'yesterday'
        : 'tomorrow'
      : `${n}d`,
    week: (n, past) => n === 1
      ? past
        ? 'last week'
        : 'next week'
      : `${n} week${n > 1 ? 's' : ''}`,
    hour: n => `${n}h`,
    minute: n => `${n}min`,
    second: n => `${n}s`,
  },
})
</script>

<template>
  <div ref="el" flex flex-col gap-2 my-4 @click="go">
    <AccountInfo :account="status.account">
      <div flex-auto />
      <div text-sm op50>
        {{ timeago }}
      </div>
    </AccountInfo>
    <StatusBody :status="status" />
    <StatusMedia
      v-if="status.mediaAttachments?.length"
      :status="status"
    />
    <StatusActions :status="status" />
  </div>
</template>
