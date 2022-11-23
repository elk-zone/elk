<script setup lang="ts">
import type { Status } from 'masto'

const props = withDefaults(
  defineProps<{
    status: Status
    actions?: boolean
  }>(),
  {
    actions: true,
  },
)

const status = $computed(() => {
  if (props.status.reblog && !props.status.content)
    return props.status.reblog
  return props.status
})

const rebloggedBy = $computed(() => props.status.reblog ? props.status.account : null)

const el = ref<HTMLElement>()
const router = useRouter()

function go(e: MouseEvent) {
  const path = e.composedPath() as HTMLElement[]
  const el = path.find(el => ['A', 'BUTTON', 'IMG', 'VIDEO'].includes(el.tagName?.toUpperCase()))
  if (!el)
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
  <div ref="el" flex flex-col gap-2 px-4 hover:bg="gray/10" transition="duration-100" cursor-pointer @click="go">
    <div v-if="rebloggedBy" pl8>
      <div flex gap-1 items-center text-gray:75 text-sm>
        <div i-ri:repeat-fill mr-1 />
        <AccountInlineInfo font-bold :account="rebloggedBy" />
        reblogged
      </div>
    </div>
    <AccountInfo :account="status.account">
      <template #default>
        <div flex-auto />
        <div text-sm op50 :title="status.createdAt">
          {{ timeago }}
        </div>
      </template>
    </AccountInfo>
    <StatusReplyingTo :status="status" ml5 mt--1 />
    <div pl15>
      <StatusBody :status="status" />
      <StatusMedia
        v-if="status.mediaAttachments?.length"
        :status="status"
      />
      <StatusCard
        v-if="status.reblog"
        :status="status.reblog" border="~ rounded"
        :actions="false"
      />
    </div>
    <StatusActions v-if="actions !== false" pl13 :status="status" />
  </div>
</template>
