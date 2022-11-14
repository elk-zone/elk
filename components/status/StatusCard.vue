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
  const hasButton = path.find(el => ['A', 'BUTTON', 'P'].includes(el.tagName.toUpperCase()))
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
  <div ref="el" flex flex-col gap-2 my-2 px-4 @click="go">
    <div v-if="rebloggedBy" pl8>
      <div flex gap-1 items-center text-gray:75 text-sm>
        <div i-ri:repeat-fill mr-1 />
        <a :href="`/@${rebloggedBy.acct}`" flex gap-2 font-bold items-center>
          <img :src="rebloggedBy.avatar" class="w-5 h-5 rounded">
          {{ rebloggedBy.displayName }}
        </a>
        reblogged
      </div>
    </div>
    <AccountInfo :account="status.account">
      <div flex-auto />
      <div text-sm op50>
        {{ timeago }}
      </div>
    </AccountInfo>
    <div pl14>
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
    <StatusActions v-if="actions !== false" pl12 :status="status" />
  </div>
</template>
